import { restartAppByName, stopAppByName } from '../libs/pm2.js'

export const tickerClosedServer = () => async (ctx, next) => {
  try {
    const { name } = ctx.request.body || {}
    ctx.data = { res_code: 9999, res_message: 'success.', res_data: '' }
    if (!name) return next()

    stopAppByName(name)
    ctx.data = { res_code: 9999, res_message: `Stop pm2: ${name} is success.`, res_data: '' }
    return next()
  } catch (error) {
    throw console.log('throw error: ', error)
  }
}

export const tickerOpenServer = () => async (ctx, next) => {
  try {
    const { name } = ctx.request.body || {}
    ctx.data = { res_code: 9999, res_message: 'success.', res_data: '' }
    if (!name) return next()

    restartAppByName(name)
    ctx.data = { res_code: 9999, res_message: `Restart pm2: ${name} is success.`, res_data: '' }
    return next()
  } catch (error) {
    throw console.log('throw error: ', error)
  }
}
