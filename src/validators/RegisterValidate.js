// import { AssetRegexValidate } from '../libs/regex.js'
import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import { cacheDataWithKey } from '../controllers/cachingController.js'

export const registerValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      ctx.isMobile = true
      const language = ctx.language ? ctx.language : Language
      const platform = ctx.request.headers['x-platform']

      ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({
        max: 250
      })
      ctx.checkBody('password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('password', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({ max: 250 })
      ctx.checkBody('country', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('country', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 150')).len({ max: 150 })
      //   ctx.checkBody('invite_reference_key', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      //   ctx.checkBody('invite_reference_key', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })
      ctx.checkHeaders('x-platform', await getDataResponse(language, 'HEADER_REQUIRED_PLATFORM', { params: 'x-platform' })).notEmpty()

      const platforms = ['IOS', 'ANDROID', 'WEB', 'MOBILE', 'SOCKET']
      const isPlatformValid = platforms.includes(platform)
      if (!isPlatformValid) return (ctx.body = await getDataResponse(language, 'INVALID_VALUE', {}, 'x-platform'))

      let errors = await ctx.validationErrors()
      //   const AssetValidate = AssetRegexValidate(errors)

      //   errors = AssetValidate(inviteReferenceKey, 'invite_reference_key', await getDataResponse(language, 'SPECIAL_CHARACTER_NOT_ALLOW'), /^[a-zA-Z0-9_]+$/)
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'registerValidate')
    }
  }

export const resendOTPValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({ max: 250 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'resendOTPValidate')
    }
  }

export const verifyOTPValidate =
  (type = 'VERIFY', Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.isMobile = ctx.userAgent.browser.toLowerCase() === 'dart' ? true : false

      if (type === 'VERIFY') {
        ctx.checkBody('verifyType', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
        ctx.checkBody('verifyType', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 30')).len({ max: 30 })
      }

      ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({ max: 250 })
      ctx.checkBody('otp', await getDataResponse(language, 'REQUIRED_ONLY_NUMBER', {})).isInt()
      ctx.checkBody('otp', await getDataResponse(language, 'CHARACTER_FIXED_LENGTH', 'Characters fixed: 6')).len({ min: 6, max: 6 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      const { email } = ctx.request.body
      const findDuplicate = await cacheDataWithKey({ email }, `CACHE_VERIFY_OTP_${type}`)
      if (findDuplicate) return (ctx.body = await getDataResponse(language, 'MANY_REQUEST_VERIFY', { param: 'verify_otp' }))

      return next()
    } catch (error) {
      throw throwError(error, 'verifyOTPValidate')
    }
  }

export const verifyURLValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language

      ctx.checkBody('verifyUrlCode', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('verifyUrlCode', await getDataResponse(language, 'CHARACTER_FIXED_LENGTH', 'Characters fixed: 150')).len({ min: 150, max: 150 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'verifyURLValidate')
    }
  }

export const createPinValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.checkBody('pin', await getDataResponse(language, 'REQUIRED_ONLY_NUMBER', {})).isInt()
      ctx.checkBody('pin', await getDataResponse(language, 'CHARACTER_FIXED_LENGTH', 'Characters fixed: 6')).len({ min: 6, max: 6 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'createPinValidate')
    }
  }
