import { getTimestamp, getnonce, generateSignature } from './src/helper'
import config from './src/config'

const timestamp = getTimestamp()
const nonce = getnonce()

const params = JSON.parse(process.argv[2])
params.timestamp = timestamp
params.nonce = nonce

const signature = generateSignature(params, config.secret_key)

console.log(
  'timestamp: %s, nonce: %s,new signature: %s',
  timestamp,
  nonce,
  signature,
)
