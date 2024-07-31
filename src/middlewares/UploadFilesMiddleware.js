import { throwError } from '../libs/index.js'
import { googleUploadImage } from '../libs/googlestorage.js'
import { getDataResponse } from '../messages/index.js'

export const uploadImage = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const { reference_key } = ctx.findUser
    if (!ctx.hasImage) return (ctx.body = await getDataResponse(language, 'UPLOAD_FAILED', { form_data: 'has image' }))

    const urlImage = await googleUploadImage(ctx.hasImage, reference_key, 'info')
    if (!urlImage) return (ctx.body = await getDataResponse(language, 'UPLOAD_FAILED', { form_data: 'image' }))
    ctx.imageUrl = urlImage
    return next()
  } catch (error) {
    throw throwError(error, 'uploadImage')
  }
}
