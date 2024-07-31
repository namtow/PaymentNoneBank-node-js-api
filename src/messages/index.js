import { cacheFindAllDb } from '../controllers/cachingController.js'
import { templateResponse } from '../libs/tempateResponse.js'

const RESPONSE = 'Response'
const LANGUAGES = 'Languages'

export const getDataResponse = async (language, message, data = '', anotherMessage = '') => {
  if (!language) return templateResponse('9778', 'Language data is not found.')

  // // check cache response model data
  const [responseModel, languageModel] = await Promise.all([cacheFindAllDb(RESPONSE), cacheFindAllDb(LANGUAGES)])
  if (responseModel && languageModel) {
    const obj = JSON.parse(responseModel) // convert string to object
    const objLanguage = JSON.parse(languageModel)
    const { id: languageId } = objLanguage.find(v => v.code === language.toUpperCase())
    const filterDataMessage = obj.filter(v => v.name === message && v.language_id === languageId)
    if (!filterDataMessage.length) return templateResponse('9768', 'ResponseLanguageModels is not found.')
    const [{ code, description }] = filterDataMessage
    return templateResponse(code, `${description} ${anotherMessage}`, data)
  }
  return templateResponse('9898', 'Something wrong and have no data caching')
}
