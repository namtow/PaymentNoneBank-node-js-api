// const env = process.env.NODE_ENV || 'development'
// import config from 'config'
// import moment from 'moment'
import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB } from '../libs/mongo.js'
import { switchCaseRefreshToken } from '../middlewares/AuthenticationMiddleware.js'
import { decodeJWTToken } from '../libs/jwt.js'
import { REGISTERS, DEVICELOG } from '../enum/index.js'
// const apiPassPhase = config.get('apiPassPhase')

export const headerAccessTokenValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.checkHeaders('x-access-token', await getDataResponse(language, 'HEADER_REQUIRED_ACCESS_TOKEN')).notEmpty()

      let errors = await ctx.validationErrors()
      if (errors) {
        let error = errors[0]
        error.msg.res_data = { param: error.param }
        return (ctx.body = error.msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'headerAccessTokenValidate')
    }
  }

export const headerAccessTokenWithPinValidate = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const token = ctx.request.headers['x-access-token']
    ctx.isPinLogin = false
    ctx.tokenType = ctx.request.headers['x-platform']
    if (!token) return next()

    const decode = await decodeJWTToken(token)
    if (!decode) return (ctx.body = await getDataResponse(language, 'ACCESS_TOKEN_IS_NOT_TRUE', {}))
    const { key: refreshToken, token_type } = decode
    const { data: deviceData, db: deviceDB } = (await findOneDB({ access_token: token, type: token_type }, DEVICELOG)) || {}
    if (!deviceData) {
      deviceDB.close()
      return (ctx.body = await getDataResponse(language, 'ACCESS_TOKEN_IS_NOT_TRUE', {}))
    }

    const tokenType = ctx.tokenType ? (ctx.tokenType === 'IOS' || ctx.tokenType === 'ANDROID' || ctx.tokenType === 'MOBILE' ? 'MOBILE' : 'WEB') : 'WEB'
    if (tokenType !== token_type) return (ctx.body = await getDataResponse(language, 'ACCESS_TOKEN_IS_NOT_TRUE', { msg: 'token is not match platform.' }))

    const select = {}
    const selector = switchCaseRefreshToken(token_type)
    select[selector] = refreshToken

    const { data: userData, db: userDb } = (await findOneDB(select, REGISTERS)) || {}
    if (!userData) {
      userDb.close()
      return next()
    }

    const { reference_key: referenceKey } = userData
    ctx.isPinLogin = referenceKey
    ctx.tokenType = token_type

    return next()
  } catch (error) {
    throw throwError(error, 'headerAccessTokenWithPinValidate')
  }
}

export const loginWithPinValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const isPinLogin = ctx.isPinLogin
      if (!isPinLogin) return next()

      const language = ctx.language ? ctx.language : Language
      ctx.checkBody('pin', await getDataResponse(language, 'REQUIRED_ONLY_NUMBER', {})).isInt()
      ctx.checkBody('pin', await getDataResponse(language, 'CHARACTER_FIXED_LENGTH', 'Characters fixed: 6')).len({ min: 6, max: 6 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'loginWithPinValidate')
    }
  }

export const loginValidate =
  (language = 'EN') =>
  async (ctx, next) => {
    try {
      const isPinLogin = ctx.isPinLogin
      if (isPinLogin) return next()

      ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({
        max: 250
      })

      ctx.checkBody('password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('password', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })

      let errors = await ctx.validationErrors()
      if (errors) {
        let error = errors[0]
        error.msg.res_data = { param: error.param }
        return (ctx.body = error.msg)
      }
      return next()
    } catch (error) {
      throw throwError(error, 'loginValidate')
    }
  }

export const forgotPasswordValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({
        max: 250
      })

      let errors = await ctx.validationErrors()
      if (errors) {
        let error = errors[0]
        error.msg.res_data = { param: error.param }
        return (ctx.body = error.msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'forgotPasswordValidate')
    }
  }

export const changePasswordValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      const { new_password: newPassword, confirm_new_password: confirmNewPassword } = ctx.request.body

      ctx.checkBody('current_password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('new_password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('confirm_new_password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()

      if (newPassword !== confirmNewPassword) return (ctx.body = await getDataResponse(language, 'CONFIRM_PASSWORD_NOT_MATCH', { param: 'new_password, confirm_new_password' }))

      let errors = await ctx.validationErrors()
      if (errors) {
        let error = errors[0]
        error.msg.res_data = { param: error.param }
        return (ctx.body = error.msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'changePasswordValidate')
    }
  }

export const changeForgotPasswordValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      const { new_password: newPassword, confirm_new_password: confirmNewPassword } = ctx.request.body

      ctx.checkBody('new_password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('confirm_new_password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()

      if (newPassword !== confirmNewPassword) return (ctx.body = await getDataResponse(language, 'CONFIRM_PASSWORD_NOT_MATCH', { param: 'new_password, confirm_new_password' }))

      let errors = await ctx.validationErrors()
      if (errors) {
        let error = errors[0]
        error.msg.res_data = { param: error.param }
        return (ctx.body = error.msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'changeForgotPasswordValidate')
    }
  }
