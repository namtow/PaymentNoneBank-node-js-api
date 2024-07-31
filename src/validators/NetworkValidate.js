import { AssetRegexValidate } from '../libs/regex.js'
import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'

export const getBinaryValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      //   ctx.isMobile = ctx.userAgent.browser.toLowerCase() === 'dart' ? true : false
      ctx.isMobile = true
      const language = ctx.language ? ctx.language : Language
      const { reference_key } = ctx.request.body
      if (reference_key) {
        ctx.checkBody('reference_key', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
        ctx.checkBody('reference_key', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })
      }

      let errors = await ctx.validationErrors()
      const AssetValidate = AssetRegexValidate(errors)
      if (reference_key) {
        errors = AssetValidate(reference_key, 'reference_key', await getDataResponse(language, 'SPECIAL_CHARACTER_NOT_ALLOW'), /^[a-zA-Z0-9]+$/)
      }

      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'getBinaryValidate')
    }
  }

export const searchBinaryValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      ctx.checkParams('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
      ctx.checkParams('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 250')).len({
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
      throw throwError(error, 'searchBinaryValidate')
    }
  }
