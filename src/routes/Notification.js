import router from 'koa-router'
import { getDataResponse } from '../messages/index.js'
import { headerAccessTokenValidate, getBinaryValidate } from '../validators/index.js'
import { accessTokenAuthentication, basicAuthentication } from '../middlewares/AuthenticationMiddleware.js'
import { deleteAllNotification, detailAllNotification, notificationLists, readAllNotification, readOneNotification, pushNotification } from '../middlewares/NotificationMiddleware.js'
import { notificationFindIdValidate, notificationValidate, pushNotificationValidate } from '../validators/NotificationValidate.js'

const Router = new router()

Router.get('/:isRead/:type/:limit/:order', headerAccessTokenValidate(), accessTokenAuthentication(false), notificationValidate(), notificationLists(), async ctx => {
  const language = ctx.language
  const lists = ctx.lists
  ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', lists)
})

Router.post('/read/all', headerAccessTokenValidate(), accessTokenAuthentication(false), readAllNotification(), async ctx => {
  const language = ctx.language
  const lists = ctx.lists
  ctx.body = await getDataResponse(language, 'POST_DATA_SUCCESS', lists)
})

Router.get('/detail/:id', headerAccessTokenValidate(), accessTokenAuthentication(false), notificationFindIdValidate(), detailAllNotification(), async ctx => {
  const language = ctx.language
  const detail = ctx.detail
  ctx.body = await getDataResponse(language, 'GET_DATA_SUCCESS', detail)
})

Router.post('/read/id/:id', headerAccessTokenValidate(), accessTokenAuthentication(false), notificationFindIdValidate(), readOneNotification(), async ctx => {
  const language = ctx.language
  const detail = ctx.detail
  ctx.body = await getDataResponse(language, 'POST_DATA_SUCCESS', detail)
})

Router.post('/delete/all', headerAccessTokenValidate(), accessTokenAuthentication(false), deleteAllNotification(), async ctx => {
  const language = ctx.language
  const lists = ctx.lists
  ctx.body = await getDataResponse(language, 'DELETE_DATA_SUCCESS', lists)
})

// Router.post('/push', basicAuthentication(), getBinaryValidate(), pushNotificationValidate(), pushNotification(), async ctx => {
//   const language = ctx.language
//   const message = ctx.responseMessage
//   ctx.body = await getDataResponse(language, 'POST_DATA_SUCCESS', message)
// })

export default Router
