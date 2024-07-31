import seeder from '../seeder/seeder.js'
import Caching from '../libs/redis.js'
import { findAllDB, insertMany } from '../libs/mongo.js'
import { LANGUAGES, RESPONSE, COUNTRY } from '../enum/index.js'
const { responses, languages, countries } = seeder

export const MasterDataCreate = async () => {
  // for kill old cache
  Caching.flushallRedis()

  // check has data in database
  const [{ data: LanguageData, db: LanguageDB }, { data: ResponseModelData, db: ResponseModelDB }, { data: CountryData, db: CountryDB }] = await Promise.all([findAllDB({}, LANGUAGES), findAllDB({}, RESPONSE), findAllDB({}, COUNTRY)])

  // Master Data ---- Languages Model Create ------
  // Master Data ---- Responses Model Create ------
  // Master Data ---- Countries Model Create ------
  await createLanguages(languages, LanguageData, LanguageDB)
  await createResponseModels(responses, ResponseModelData, languages, ResponseModelDB)
  await createCountries(countries, CountryData, CountryDB)

  async function createLanguages(languages, LanguageData, LanguageDB) {
    if (languages.length !== LanguageData.length) {
      const createData = []
      for (const key in languages) {
        if (languages.hasOwnProperty(key)) {
          const language = languages[key]
          const isFound = LanguageData.find(v => v.code === language.code)
          if (!isFound) {
            createData.push({
              id: language.id,
              name: language.name,
              code: language.code,
              status: language.status
            })
          }
        }
      }
      if (createData.length) {
        const created = await insertMany(createData, LANGUAGES)
        created.db.close()
        LanguageDB.close()
      }
    }
  }

  async function createResponseModels(responses, ResponseModelData, languages, ResponseModelDB) {
    if (responses.length !== ResponseModelData.length) {
      const createData = []
      for (let index = 0; index < responses.length; index++) {
        const v = responses[index]
        v.responses.map(async response => {
          const isFound = ResponseModelData.filter(current => current.name === response.name)
          if (!isFound.length) {
            response.description.map(async desc => {
              const language = languages.find(lang => lang.code === desc.language)
              if (language) {
                createData.push({
                  name: response.name,
                  language_id: language.id,
                  group: v.group,
                  code: response.code,
                  description: desc.description
                })
              }
            })
          }
        })
      }
      if (createData.length) {
        const created = await insertMany(createData, RESPONSE)
        created.db.close()
        ResponseModelDB.close()
        Caching.flushallRedis()
      }
    }
  }

  async function createCountries(countries, CountryData, CountryDB) {
    if (countries.length !== CountryData.length) {
      const createData = []
      for (const key in countries) {
        if (countries.hasOwnProperty(key)) {
          const country = countries[key]
          const isFound = CountryData.find(v => v.country_name === country.country_name)
          if (!isFound) {
            createData.push({
              country_name: country.country_name,
              dial_code: country.dial_code,
              country_code: country.country_code,
              latitude: country.latitude,
              longitude: country.longitude
            })
          }
        }
      }
      if (createData.length) {
        const created = await insertMany(createData, COUNTRY)
        created.db.close()
        CountryDB.close()
      }
    }
  }

  return 'Set MasterData is success.'
}
