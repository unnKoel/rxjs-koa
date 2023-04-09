import { Middleware } from 'koa'
import { getTimestamp, generateSignature, ParamsToSign } from '../helper'

export class SignatureError extends Error {}

const signatureValidate: (secret: string, expire: number) => Middleware =
  (secret, expire) => async (ctx, next) => {
    const { query, body } = ctx.request
    const params = Object.keys(query).length
      ? query
      : (body as Record<string, string>)
    const { nonce, timestamp, signature } = params

    if (!nonce || !timestamp || !signature) {
      throw new SignatureError(
        'lacking necessary paramers related to signature',
      )
    }

    if (
      parseInt(
        (
          Math.abs(Number(getTimestamp()) - Number(timestamp)) / 1000
        ).toString(),
      ) > expire
    ) {
      throw new SignatureError('Signature is expired')
    }

    const validatedSignature = generateSignature(params as ParamsToSign, secret)

    if (signature !== validatedSignature) {
      throw new SignatureError("Signature doesn't match")
    }

    await next()
  }

export default signatureValidate
