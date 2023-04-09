import sha256 from 'crypto-js/sha256'
import hmacSHA512 from 'crypto-js/hmac-sha512'
import Base64 from 'crypto-js/enc-base64'

export type ParamsToSign = Record<string, string | string[]> & {
  timestamp: string
  nonce: string
}

const randomString = (length: number): string => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

const genearteHmacDigest = (secret: string, strTosign: string): string => {
  const hashDigest = sha256(Buffer.from(strTosign, 'utf8').toString())
  const hmacDigest = Base64.stringify(hmacSHA512(hashDigest, secret))

  return hmacDigest
}

export const getTimestamp = (): string => new Date().getTime().toString()
export const getnonce = (): string => randomString(20)

export const generateSignature = (
  params: ParamsToSign,
  secret: string,
): string => {
  const strToSign = Object.keys(params)
    .filter((key) => key !== 'signature')
    .sort()
    .reduce((strToSign, key) => {
      let value = params[key]

      value = Array.isArray(value) ? value.toString() : value
      return `${strToSign}&${key}=${value}`
    }, '')
    .substring(1)

  const signature = genearteHmacDigest(secret, strToSign)

  return signature
}
