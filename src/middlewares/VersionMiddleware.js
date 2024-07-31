export const getVersion = () => async (ctx, next) => {
  try {
    console.log(ctx.ip)
    ctx.getVersion = { res_code: 9999, res_message: 'success.', res_data: 'version 1' }
    return next()
  } catch (error) {
    throw console.log('throw error: ', error)
  }
}
