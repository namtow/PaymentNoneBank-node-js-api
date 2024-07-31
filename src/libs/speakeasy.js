const env = process.env.NODE_ENV || 'development'
import config from 'config'
import speakeasy from 'speakeasy'

const twofactor = config.get('twofactor')
const { issuer, encoding } = twofactor

export const generateTwoFactor = async label => {
  const secret = speakeasy.generateSecret()
  const { base32 } = secret
  const otpAuthURL = speakeasy.otpauthURL({
    secret: base32,
    label,
    issuer,
    encoding
  })
  const twofactorObject = {
    secret: base32,
    otpAuthURL
  }
  return twofactorObject
}

export const totpVerify = (token, secret) => speakeasy.totp.verify({ secret, token, encoding })
