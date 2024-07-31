import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import { AssetRegexValidate } from '../libs/regex.js'

export const notificationValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      const { isRead, type, limit, order } = ctx.params
      ctx.checkParams('type', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('type', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })
      ctx.checkParams('limit', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('limit', await getDataResponse(language, 'REQUIRED_ONLY_NUMBER')).isInt()
      ctx.checkParams('limit', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 11')).len({ max: 11 })
      ctx.checkParams('order', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('order', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })
      ctx.checkParams('isRead', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('isRead', await getDataResponse(language, 'REQUIRED_ONLY_NUMBER')).isInt()
      ctx.checkParams('isRead', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 1')).len({ max: 1 })

      let errors = await ctx.validationErrors()
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      if (+limit <= 0) return (ctx.body = await getDataResponse(language, 'REQUIRED_ONLY_POSITIVE_NUMBER', { param: 'limit' }))
      if (+isRead < 0) return (ctx.body = await getDataResponse(language, 'REQUIRED_ONLY_POSITIVE_NUMBER', { param: 'isRead' }))
      if (order === 'DESC' || order === 'ASC') {
        switch (type) {
          case 'ALL_ACTION':
            return next()
          case 'DEPOSIT':
            return next()
          case 'WITHDRAW':
            return next()
          case 'BUY_PACKAGE':
            return next()
          case 'PACKAGE_BONUS':
            return next()
          case 'IB_BONUS':
            return next()
          case 'POOL_BONUS':
            return next()
          case 'BINARY_BONUS':
            return next()
          case 'USER_USED_INVITE':
            return next()
          case 'SERVICE_TRADE_ERROR':
            return next()
          default:
            return (ctx.body = await getDataResponse(language, 'HAS_PROBLEM_NOTIFICATION', { param: 'type' }))
        }
      } else {
        return (ctx.body = await getDataResponse(language, 'HAS_PROBLEM_NOTIFICATION', { param: "Order is invalid, Please use 'ASC' or 'DESC'." }))
      }
    } catch (error) {
      throw throwError(error, 'notificationValidate')
    }
  }

export const notificationFindIdValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      const { id } = ctx.params
      ctx.checkParams('id', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkParams('id', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 100')).len({ max: 100 })

      let errors = await ctx.validationErrors()
      const AssetValidate = AssetRegexValidate(errors)

      errors = AssetValidate(id, 'id', await getDataResponse(language, 'SPECIAL_CHARACTER_NOT_ALLOW'), /^[a-zA-Z0-9]+$/)
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      return next()
    } catch (error) {
      throw throwError(error, 'notificationFindIdValidate')
    }
  }

export const pushNotificationValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      const { topic, message, type } = ctx.request.body

      ctx.checkBody('topic', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('topic', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 255')).len({ max: 255 })
      ctx.checkBody('type', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
      ctx.checkBody('type', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 50')).len({ max: 50 })

      let errors = await ctx.validationErrors()
      const AssetValidate = AssetRegexValidate(errors)

      AssetValidate(topic, 'topic', await getDataResponse(language, 'SPECIAL_CHARACTER_NOT_ALLOW'), /^[a-zA-Zก-๙0-9()'"#.:@/,_\- ]+$/)
      errors = AssetValidate(message, 'message', await getDataResponse(language, 'SPECIAL_CHARACTER_NOT_ALLOW'), /^[a-zA-Zก-๙0-9()'"#\r\n.:@/,_\- ]+$/)
      if (Object.keys(errors).length) {
        let { msg, param } = errors[0]
        msg.res_data = { param, description: msg.res_data }
        ctx.status = 400
        return (ctx.body = msg)
      }

      switch (type) {
        case 'SERVICE_TRADE_ERROR':
          return next()
        default:
          return (ctx.body = await getDataResponse(language, 'HAS_PROBLEM_NOTIFICATION', { param: 'type' }))
      }
    } catch (error) {
      throw throwError(error, 'pushNotificationValidate')
    }
  }
