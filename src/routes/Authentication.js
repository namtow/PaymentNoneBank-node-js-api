import router from 'koa-router'
import { basicAuthentication, accessTokenAuthentication, Login, PINLogin, retrieveMacAddress, refreshAccessToken } from '../middlewares/AuthenticationMiddleware.js'
import { updateUserPassword, updateUserForgotPassword } from '../middlewares/AccountMiddleware.js'
import { getDataResponse } from '../messages/index.js'
import { headerAccessTokenValidate, loginValidate, headerAccessTokenWithPinValidate, forgotPasswordValidate, changePasswordValidate, verifyOTPValidate, changeForgotPasswordValidate } from '../validators/index.js'
// import { creatUserWallet } from '../middlewares/WalletMiddleware'
import { resendOTP, verifyForgotPassword } from '../middlewares/RegisterMiddleware.js'

const Router = new router()

Router.get('/', basicAuthentication(), async ctx => {
  const language = ctx.language
  ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', { data: 'hi' })
})

Router.get('/token', headerAccessTokenValidate(), accessTokenAuthentication(false), async ctx => {
  const language = ctx.language
  const isAuth = ctx.isAuth
  const token = ctx.token
  ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', { data: 'hi', token, isAuth })
})

Router.post(
  '/login',
  basicAuthentication(),
  headerAccessTokenWithPinValidate(),
  retrieveMacAddress(),
  loginValidate(),
  Login(),
  PINLogin(),
  // creatUserWallet(),
  async ctx => {
    const language = ctx.language
    const isAuth = ctx.isAuth
    const token = ctx.token
    ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', { token, isAuth })
  }
)

Router.post('/refresh_token', basicAuthentication(), retrieveMacAddress(), refreshAccessToken(), async ctx => {
  const language = ctx.language
  const token = ctx.token
  ctx.body = await getDataResponse(language, 'UPDATE_DATA_SUCCESS', { token })
})

Router.post('/change_password', headerAccessTokenValidate(), accessTokenAuthentication(), retrieveMacAddress(), changePasswordValidate(), updateUserPassword(), async ctx => {
  const language = ctx.language
  ctx.body = await getDataResponse(language, 'UPDATE_DATA_SUCCESS')
})

Router.post('/forgot_password', basicAuthentication(), forgotPasswordValidate(), retrieveMacAddress(), resendOTP('FORGOT_PASSWORD'), async ctx => {
  const language = ctx.language
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS')
})

Router.post('/submit/forgot_password/otp', basicAuthentication(), verifyOTPValidate(), retrieveMacAddress(), changeForgotPasswordValidate(), verifyForgotPassword(), updateUserForgotPassword(), async ctx => {
  const language = ctx.language
  const token = ctx.token
  const isAuth = ctx.isAuth
  ctx.body = await getDataResponse(language, 'SEND_MAIL_SUCCESS', { token, isAuth })
})

export default Router
