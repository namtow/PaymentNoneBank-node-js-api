import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import fileType from 'file-type'
import fs from 'fs'
import config from 'config'

const configFilterImages = config.get('_filterFile').image_type

export const uploadFilesValidate =
  (Language = 'EN') =>
  async (ctx, next) => {
    try {
      const language = ctx.language ? ctx.language : Language
      if (!ctx.request.files)
        return (ctx.body = await getDataResponse(language, 'MISSING_REQUIRED_FILES', {
          form_data: 'image'
        }))

      const files = ctx.request.files
      const { image } = files || {}
      if (!image)
        return (ctx.body = await getDataResponse(language, 'MISSING_REQUIRED_FILES', {
          form_data: 'image'
        }))
      if (!Object.keys(files).length)
        return (ctx.body = await getDataResponse(language, 'MISSING_REQUIRED_FILES', {
          form_data: 'image'
        }))

      const {
        image: { path, name, type }
      } = files || {}

      // Disable limit name length
      if (name.length > 250) return (ctx.body = await getDataResponse(language, 'CHARACTER_OVER_LENGTH'))

      const readFile = fs.readFileSync(path)
      if (!readFile.length) return (ctx.body = await getDataResponse(language, 'MISSING_REQUIRED_FILES', { form_data: 'image_front' }))
      const getExt = await fileType.fromBuffer(readFile)
      if (!getExt) return (ctx.body = await getDataResponse(language, 'FILE_EXTENSION_NOT_ALLOW'))
      const { ext } = getExt
      const extFilter = configFilterImages.filter(v => v === ext)
      if (!extFilter.length) return (ctx.body = await getDataResponse(language, 'FILE_EXTENSION_NOT_ALLOW'))

      ctx.hasImage = { name, path, type }
      return next()
    } catch (error) {
      throw throwError(error, 'uploadFilesValidate')
    }
  }
