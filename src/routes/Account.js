import router from 'koa-router'
import { getDataResponse } from '../messages/index.js'
import { getBinaryValidate, headerAccessTokenValidate } from '../validators/index.js'
import { accessTokenAuthentication } from '../middlewares/AuthenticationMiddleware.js'
import { GetUserInfo, accountInfoUpload } from '../middlewares/AccountMiddleware.js'
import { uploadFilesValidate } from '../validators/UploadValidate.js'
import { uploadImage } from '../middlewares/UploadFilesMiddleware.js'

const Router = new router()

Router.get('/info', headerAccessTokenValidate(), getBinaryValidate(), accessTokenAuthentication(), GetUserInfo(), async ctx => {
  const language = ctx.language
  const responseData = ctx.responseData
  ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', responseData)
})

Router.post('/image/upload', headerAccessTokenValidate(), accessTokenAuthentication(), uploadFilesValidate(), uploadImage(), accountInfoUpload('ACCOUNT_INFO', 'ACTIVE'), async ctx => {
  const language = ctx.language
  const details = ctx.userImageDetails
  ctx.body = await getDataResponse(language, 'POST_DATA_SUCCESS', details)
})

export default Router
