import { pathToRegexp, Key } from 'path-to-regexp'
import { Observable } from 'rxjs'
import createError from 'http-errors'
import { Ctx } from '../model'

interface Matcher {
  keys: Key[]
  regex: RegExp
}
type Cache = Record<string, Matcher>

export enum Method {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
}

const cache: Cache = {}

const getMatcher = (pattern: string): Matcher => {
  let matcher = cache[pattern]
  if (!matcher) {
    const keys: Key[] = []
    const regex = pathToRegexp(pattern, keys)
    matcher = cache[pattern] = { keys, regex }
  }

  return matcher
}

type Params = Record<string, string>

const parseParams = (match: RegExpExecArray, keys: Key[]): Params =>
  match.slice(1).reduce<Params>((params, value, index) => {
    params[keys[index].name] = value
    return params
  }, {})

const matchPattern = (
  pattern: string,
  pathname: string,
): { pathname: string; params: Params } | null => {
  const matcher = getMatcher(pattern)
  const match = matcher.regex.exec(pathname)

  if (match) {
    const params = parseParams(match, matcher.keys)
    return { pathname, params }
  } else {
    return null
  }
}

interface Route {
  (pattern: string, method: Method): (
    observable: Observable<Ctx>,
  ) => Observable<Ctx>

  patterns?: Array<{ pattern: string; method: Method }>
}

const matchRoutes = (
  patterns: Array<{ pattern: string; method: Method }>,
  path: string,
  method: Method,
): { pattern: string; method: Method; params: Params; route: boolean } => {
  const matched = {
    pattern: '',
    method: Method.Get,
    params: {},
    route: false,
  }
  for (let i = 0; i < patterns.length; i++) {
    const { pattern, method: specifiedMethod } = patterns[i]
    const matchedPath = matchPattern(pattern, path)
    const matchedPathAndMethod =
      // eslint-disable-next-line no-self-compare
      matchedPath && specifiedMethod.toLowerCase() === method.toLowerCase()
    if (matchedPathAndMethod) {
      matched.params = matchedPath.params
      matched.route = true
      matched.pattern = pattern
      matched.method = specifiedMethod
      return matched
    }
  }

  return matched
}

const route: Route =
  (pattern: string, method: Method) => (observable: Observable<Ctx>) => {
    route.patterns = route.patterns ?? []
    route.patterns.push({ pattern, method })

    return new Observable<Ctx>((subscriber) => {
      const subscription = observable.subscribe({
        async next(Ctx) {
          const { ctx } = Ctx
          const matched = matchRoutes(
            route.patterns ?? [],
            ctx.path,
            ctx.method as Method,
          )
          if (!matched.route) {
            subscriber.error(createError(404))
            return
          }

          if (
            matched.route &&
            matched.pattern === pattern &&
            matched.method === method
          ) {
            ctx.params = matched.params
            subscriber.next(Ctx)
          }
        },
        error: subscriber.error,
        complete: subscriber.complete,
      })

      return () => {
        subscription.unsubscribe()
      }
    })
  }

export default route
