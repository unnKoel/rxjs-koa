import { pathToRegexp, Key } from 'path-to-regexp'
import { Observable } from 'rxjs'
import HttpErrors from './http-error'

interface Matcher {
  keys: Key[]
  regex: RegExp
}
type Cache = Record<string, Matcher>

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

const route =
  <T extends { path: string; method: string; params: Record<string, string> }>(
    pattern: string,
    method: string,
  ) =>
  (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      observable.subscribe({
        next(value) {
          const matched = matchPattern(pattern, value.path)
          const methodEqual =
            method.toLowerCase() === value.method.toLowerCase()
          if (matched && methodEqual) {
            value.params = matched.params
            subscriber.next(value)
          } else {
            subscriber.error(HttpErrors.NotFound('no route matched'))
          }
        },
        error: subscriber.error,
        complete: subscriber.complete,
      })
    })

export default route
