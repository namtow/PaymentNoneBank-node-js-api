import { cacheFindAllDb } from '../controllers/cachingController.js'

const LANGUAGES = 'Languages'

export const languageProject = async (language = 'EN') => {
  // check redit/cache response model language data
  const checkLanguage = await cacheFindAllDb(LANGUAGES)
  if (checkLanguage) {
    const obj = JSON.parse(checkLanguage) // convert string to object
    const filterDataLanguage = obj.filter(v => v.code === language) // match language Request and language Cache
    const [{ code }] = filterDataLanguage.length ? filterDataLanguage : [{ code: 'EN' }] //  ใช้กรณี Object เป็นค่าว่าง เพื่อให้ "const [{code}]" ไม่ error และ default values = 'EN'
    return code
  }
  return 'EN' // set default project language = 'EN'
}
