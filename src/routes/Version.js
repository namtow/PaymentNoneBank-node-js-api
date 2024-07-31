import router from 'koa-router'
import { getVersion } from '../middlewares/VersionMiddleware.js'

const Router = new router()

Router.get('/', getVersion(), async ctx => {
  ctx.body = ctx.getVersion
})

export default Router
