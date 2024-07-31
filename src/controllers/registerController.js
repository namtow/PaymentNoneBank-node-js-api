import moment from 'moment'
import generateKey from 'generate-key'
import otpGenerator from 'otp-generator'
import { generatePassword } from '../libs/password.js'
// import { createUser, updateUser } from '../models/Users.js'
import { insertMany, updateOne } from '../libs/mongo.js'
import { REGISTERS } from '../enum/index.js'
import pkg from 'uuid'
const { v4: uuidv4 } = pkg

export const createAccount = async (data, isOAuth = false, isMobile = false) => {
  const { email, reference_key: referenceKey, invite_reference_key, password, authenticator } = data
  const key = uuidv4().replace(/-/g, '') // web
  const keyMobile = uuidv4().replace(/-/g, '') // mobile
  const keySocket = uuidv4().replace(/-/g, '') // socket
  const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false })
  const urlCode = generateKey.generateKey(99)

  if (!isOAuth) {
    data.password = generatePassword(password)
  }

  data.refresh_token = key
  data.refresh_token_mobile = keyMobile
  data.refresh_token_socket = keySocket
  data.verify_type = 'REGISTER'

  if (isMobile) {
    data.verify_code = otp
    data.verify_expire = moment().utc().add(30, 'm').format('YYYY-MM-DD HH:mm:ss')
  } else {
    data.verify_url_code = urlCode
    data.verify_url_expire = moment().utc().add(30, 'm').format('YYYY-MM-DD HH:mm:ss')
  }
  const { data: account, db: accountDb } = await insertMany([data], REGISTERS)
  accountDb.close()
  return { id: account.insertedIds['0'], email, reference_key: referenceKey, invite_reference_key, authenticator, refresh_token: data.refresh_token, verification_code: isMobile ? otp : urlCode, is_verified: data.is_verified }
}

export const updateOTP = async ({ email, status }, verifyType) => {
  const durationValue = verifyType === 'REGISTER' ? 30 : 15
  // const duration = verifyType === 'REGISTER' ? 'days' : 'minutes'
  const duration = verifyType === 'REGISTER' ? 'minutes' : 'minutes'
  const verifyExpire = moment().utc().add(durationValue, duration).format('YYYY-MM-DD HH:mm:ss')
  const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false })

  const setData = { verify_type: verifyType, verify_expire: verifyExpire, verify_code: otp }
  const { data: updatedUser, db: updatedUserDB } = (await updateOne({ email, status }, setData, REGISTERS)) || {}
  return { otp, verifyExpire, db: updatedUserDB }
}

// export const updateVerifyURLCode = async userId => {
//   const verifyExpire = moment().utc().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
//   const urlCode = generateKey.generateKey(150)
//   updateUser({ id: userId }, { verify_url_expire: verifyExpire, verify_url_code: urlCode })
//   return { urlCode, verifyExpire }
// }
