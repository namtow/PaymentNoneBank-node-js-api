// const env = process.env.NODE_ENV || 'development'
// import config from 'config'
// import moment from 'moment'
import { passwordVerify, generatePassword } from '../libs/password.js'
import { encodeJWTToken } from '../libs/jwt.js'
// import { createDevice } from '../models/Devices.js'
import { ipAuthLoginFailure, filterTokenType } from '../middlewares/AuthenticationMiddleware.js'
import { insertMany, deleteOne, updateOne } from '../libs/mongo.js'
import { DEVICELOG, REGISTERS, RESETPASSWORD } from '../enum/index.js'

// const authen = config.get('auth')

export const verifyChangePassword = (inputCurrentPassword, password) => passwordVerify(inputCurrentPassword, password)
export const changePassword = async (newPassword, reference_key, old_password, macAddress, ip) => {
  const password = generatePassword(newPassword)
  const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key }, { password }, REGISTERS)) || {}
  const { data: updatedPasswordUser, db: updatedPasswordUserDB } = (await updateOne({ reference_key, macAddress }, { password, old_password, macAddress, ip }, RESETPASSWORD)) || {}
  updatedUserDB.close()
  updatedPasswordUserDB.close()
  return { password }
}

export const userLogin = async (user, password, ip, type) => {
  const { password: pHash } = user
  const isTrue = passwordVerify(password, pHash)
  if (!isTrue) {
    ipAuthLoginFailure(user, password, ip, type)
    return null
  }

  return user
}

export const jwtEncodeLogin = async (referenceKey, ip, refreshToken, isMobile, loginType, firebaseToken, userMacAddress, tokenType) => {
  const tokenTypeFilter = filterTokenType(tokenType)
  const applicationType = isMobile ? 'MOBILE' : tokenType ? tokenTypeFilter : 'WEB'
  const jwt = await encodeJWTToken({
    key: refreshToken,
    login_type: loginType,
    token_type: applicationType
  })
  const created = { reference_key: referenceKey, type: applicationType, access_token: jwt, ip, firebase_token: firebaseToken, mac_address: userMacAddress }
  await deleteOne({ reference_key: referenceKey, type: applicationType }, DEVICELOG)
  await insertMany([created], DEVICELOG)
  return jwt
}

// export const jwtEncodeCreateOrder = async order_reference_key => {
//   const now = moment().utcOffset('+07:00').format('YYYY-MM-DD HH:mm:ss')
//   const jwt = encodeJWTDynamic(
//     {
//       order_reference_key,
//       token_create_date: now,
//       timezone: '+07:00'
//     },
//     authen.password,
//     { expiresIn: '1m' }
//   )

//   return jwt
// }
