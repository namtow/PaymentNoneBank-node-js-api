import router from 'koa-router'
import { basicAuthentication, firstToken, retrieveMacAddress } from '../middlewares/AuthenticationMiddleware.js'
import { getDataResponse } from '../messages/index.js'
import { registerValidate, verifyOTPValidate, resendOTPValidate } from '../validators/index.js'
import { registerAccountQueue, verifyOTP, resendOTP, getCountryLists } from '../middlewares/RegisterMiddleware.js'
const Router = new router()

Router.get('/country/lists', basicAuthentication(), getCountryLists(), async ctx => {
  const language = ctx.language
  const lists = ctx.lists
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS', lists)
})

Router.post('/request/otp', basicAuthentication(), registerValidate(), registerAccountQueue(), async ctx => {
  const language = ctx.language
  const { id, verification_code, refresh_token, reference_key, ...info } = ctx.result
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS', info)
})

Router.post('/submit/otp', basicAuthentication(), verifyOTPValidate(), retrieveMacAddress(), verifyOTP(), firstToken(), async ctx => {
  const language = ctx.language
  const token = ctx.token
  const isAuth = ctx.isAuth
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS', { token, isAuth })
})

Router.post('/verify/otp/resend', basicAuthentication(), resendOTPValidate(), resendOTP('REGISTER'), async ctx => {
  const language = ctx.language
  const { id, verification_code, refresh_token, reference_key, ...info } = ctx.result
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS', info)
})

export default Router
