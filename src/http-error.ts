import http from 'http'
import util from 'util'

type ErrorConstructor = (
  message: string,
) => Error & { statusCode: number | string }

const statusCodes = http.STATUS_CODES
const HttpErrors: Record<string, ErrorConstructor> = {}

function createError(code: keyof typeof statusCodes, name: string) {
  return function (
    this: Error & { statusCode: number | string },
    message: string,
  ) {
    Error.captureStackTrace(this, this.constructor)
    this.name = name
    this.message = message
    this.statusCode = code
    return this
  }
}

Object.keys(statusCodes)
  .filter((code) => Number(code) >= 400)
  .forEach((code) => {
    const name = statusCodes[code]
    if (name) {
      HttpErrors[name] = createError(Number(code), name)
      util.inherits(HttpErrors[name], Error)
    }
  })

export default HttpErrors
