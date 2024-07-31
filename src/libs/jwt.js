const env = process.env.NODE_ENV || 'development'
import jwt from 'jsonwebtoken'
import config from 'config'
const JWT = config.get('jwt')

export const encodeJWTToken = async data => jwt.sign(data, JWT.hash, JWT.options)

export const decodeJWTToken = async token =>
  jwt.verify(token, JWT.hash, (err, decode) => {
    if (err) return false
    return decode
  })

export const encodeJWTDynamic = (data, hash, options) => jwt.sign(data, hash, options)

export const decodeJWTDynamic = (token, hash) =>
  jwt.verify(token, hash, (err, decode) => {
    if (err) return false
    return decode
  })

export const viewerJWT = (data, options) => jwt.decode(data, options)
