import moment from 'moment'
import Queue from 'better-queue'
import otpGenerator from 'otp-generator'
import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import { createAccount, updateOTP } from '../controllers/registerController.js'
// import { sendVerificationMail, sendForgotPasswordMail } from '../controllers/emailController.js'
import { templateResponse } from '../libs/tempateResponse.js'
import { findOneDB, updateOne, findAllDB } from '../libs/mongo.js'
import { REGISTERS, COUNTRY, FORGOTPASSWORDLOG } from '../enum/index.js'
import pkg from 'uuid'
const { v4: uuidv4 } = pkg

export const registerAccountQueue = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const isMobile = ctx.isMobile
    const { password, email, invite_reference_key: inputInviteReferenceKey, country, placement } = ctx.request.body
    const platform = ctx.request.headers['x-platform']

    const input = { password, email, inputInviteReferenceKey, country, platform, isMobile, language, placement }
    const isError = await new Promise((resolve, reject) => {
      queuingRegister.push(input, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
      .then(result => {
        ctx.result = result
        return false
      })
      .catch(error => error)
    // If error is true
    if (isError) {
      const { res_code, res_message } = isError
      return (ctx.body = templateResponse(res_code, res_message))
    }

    return next()
  } catch (error) {
    throw throwError(error, 'registerAccount')
  }
}

const queuingRegister = new Queue(
  async (input, cb) => {
    const { error, success } = await registerAccount(input)
    cb(error, success)
  },
  { maxTimeout: 50000 }
)

const registerAccount = async data => {
  const { password, email, country, platform, isMobile, language } = data
  const { data: user, db: userDb } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') } }, REGISTERS)) || {}
  if (!user) {
    const userRefKey = uuidv4().replace(/-/g, '')
    const create = {
      email,
      password,
      reference_key: userRefKey,
      platform,
      country,
      isMobile,
      status: 'INACTIVE',
      isCompany: false,
      authenticator: false,
      is_verified: false
    }

    const account = await createAccount(create, false, isMobile)
    //   const [sendMail] = await Promise.all([sendVerificationMail(account, isMobile)])
    userDb.close()
    return { error: null, success: account }
  } else {
    const { is_verified: isVerified } = user
    userDb.close()
    if (!isVerified) return { error: await getDataResponse(language, 'PLEASE_VERIFY_OTP'), success: null }
    return { error: await getDataResponse(language, 'EMAIL_IS_ALREADY_EXISTS'), success: null }
  }
}

// const placementFindEmail = async email => {
//   if (!email) return { status: false, data: undefined }
//   const { data: inviteUser, db: inviteUserDb } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, status: 'ACTIVE' }, REGISTERS)) || {}
//   if (!inviteUser) {
//     inviteUserDb.close()
//     return { status: false, data: await getDataResponse('EN', 'EMAIL_IS_UNAVAILABLE'), success: null }
//   }
//   inviteUserDb.close()
//   return { status: true, data: inviteUser.reference_key }
// }

export const resendOTP = verifyType => async (ctx, next) => {
  try {
    const language = ctx.language
    const { email } = ctx.request.body
    const status = verifyType === 'REGISTER' ? 'INACTIVE' : 'ACTIVE'
    const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, status }, REGISTERS)) || {}
    if (!user) return (ctx.body = await getDataResponse(language, 'GET_DATA_NOT_FOUND', { param: 'email' }))

    if (verifyType === 'REGISTER') {
      const { otp: newOTP, db: updatedUserDB } = await updateOTP({ email, status }, verifyType)
      //   await sendVerificationMail({ email, verification_code: newOTP })
      updatedUserDB.close()
    } else if (verifyType === 'FORGOT_PASSWORD' || verifyType === 'FORGOT_PIN') {
      const type = verifyType === 'FORGOT_PASSWORD' ? 'PASSWORD' : 'PIN'
      const { otp: newOTP, db: updatedUserDB } = await updateOTP({ email, status }, verifyType)
      //   await sendForgotPasswordMail({ email, verification_code: newOTP }, type)
      updatedUserDB.close()
    }

    userDB.close()
    ctx.result = { isSending: true }
    return next()
  } catch (error) {
    throw throwError(error, 'resendOTP')
  }
}

export const verifyForgotPassword =
  (verifyType = 'FORGOT_PASSWORD', loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const language = ctx.language
      const platform = ctx.userAgent.browser.toLowerCase()
      //   const firebaseToken = ctx.firebaseToken
      const ip = ctx.ip
      const { email, otp } = ctx.request.body

      await updateOne({ email, platform, ip, verifyType, verify_code: otp }, { email, platform, ip, verifyType, verify_code: otp, status: 'DEBUG_OTP_REQUEST' }, FORGOTPASSWORDLOG)
      const dateNow = moment().utc().format('YYYY-MM-DD HH:mm:ss')
      const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, verify_type: verifyType, verify_code: otp, status: 'ACTIVE' }, REGISTERS)) || {}
      if (!user) {
        userDB.close()
        return (ctx.body = await getDataResponse(language, 'OTP_NOT_FOUND', { param: 'otp' }))
      }

      await updateOne({ email, platform, ip, verifyType, verify_code: otp }, { email, platform, ip, verifyType, verify_code: otp, status: 'DEBUG_OTP_CHECKING_REQUEST' }, FORGOTPASSWORDLOG)
      const { verify_expire } = user
      const expireDate = moment(verify_expire).utc().format('YYYY-MM-DD HH:mm:ss')
      const dateDiff = moment(dateNow, 'YYYY-MM-DD HH:mm:ss').diff(moment(expireDate, 'YYYY-MM-DD HH:mm:ss'), 'minutes', true)
      if (dateDiff > 0) return (ctx.body = await getDataResponse(ctx.language, 'OTP_EXPIRE', { param: 'otp' }))

      await updateOne({ email, platform, ip, verifyType, verify_code: otp }, { email, platform, ip, verifyType, verify_code: otp, status: 'DEBUG_OTP_SUCCESS_REQUEST' }, FORGOTPASSWORDLOG)
      const otpChange = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false })
      const { data: updatedUser, db: updatedUserDB } =
        (await updateOne({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, verify_type: verifyType, status: 'ACTIVE' }, { verify_type: 'REGISTER', verify_code: otpChange }, REGISTERS)) || {}

      userDB.close()
      updatedUserDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'verifyForgotPassword')
    }
  }

export const getCountryLists = () => async (ctx, next) => {
  try {
    const { data: country, db: countryDB } = (await findAllDB({}, COUNTRY)) || {}
    ctx.lists = country.map(v => ({ country_name: v.country_name, country_code: v.country_code, dial_code: v.dial_code }))
    countryDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'getCountryLists')
  }
}

export const verifyOTP = () => async (ctx, next) => {
  try {
    const { email, otp, verifyType } = ctx.request.body
    const dateNow = moment().utc().format('YYYY-MM-DD HH:mm:ss')
    const status = verifyType === 'REGISTER' ? 'INACTIVE' : 'ACTIVE'
    // const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, verify_type: verifyType, status }, REGISTERS)) || {}
    const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, verify_type: verifyType, verify_code: otp, status }, REGISTERS)) || {}
    if (!user) return (ctx.body = await getDataResponse(ctx.language, 'OTP_NOT_FOUND', { param: 'otp' }))

    const { verify_expire } = user
    const expireDate = moment(verify_expire).utc().format('YYYY-MM-DD HH:mm:ss')
    const dateDiff = moment(dateNow, 'YYYY-MM-DD HH:mm:ss').diff(moment(expireDate, 'YYYY-MM-DD HH:mm:ss'), 'minutes', true)
    if (dateDiff > 0) return (ctx.body = await getDataResponse(ctx.language, 'OTP_EXPIRE', { param: 'otp' }))

    const { data: updatedUser, db: updatedUserDB } = (await updateOne({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, verify_type: verifyType, verify_code: otp, status }, { is_verified: true, status: 'ACTIVE' }, REGISTERS)) || {}
    userDB.close()
    updatedUserDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'verifyOTP')
  }
}
