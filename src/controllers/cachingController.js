const env = process.env.NODE_ENV || 'development'
import config from 'config'
import Caching from '../libs/redis.js'
import { findAllDB, findOneDB } from '../libs/mongo.js'
const { database } = config.get('mongo')

// key = CacheName
export const cacheFindAllDb = async (key = 'NOT_FOND') => {
  const CKey = database + key
  const get = await Caching.getCache(CKey) // look at cache in RAM
  if (!get) {
    const { data, db } = await findAllDB({}, key)
    if (data && data.length) await Caching.setCache(CKey, JSON.stringify(data))
    
    try {
      db.close()
    } catch (error) {
      console.error('db.close() error at cacheFindAllDb');
    }
    
    return await Caching.getCache(CKey)
  }
  return get
}

export const cacheFindOneDb = async (findDb, key = 'FIND_ONE_NOT_FOND_') => {
  const CKey = database + key + findDb
  const get = await Caching.getCache(CKey) // look at cache in RAM
  if (!get) {
    const { data, db } = await findOneDB(findDb, key)
    if (data) await Caching.setCache(CKey, JSON.stringify(data))
    db.close()
    return await Caching.getCache(CKey)
  }
  return get
}

// ProjectName + Key = CacheName
export const cacheDataWithKey = async (cacheData, key = 'CACHE_DATA_') => {
  const CKey = database + key + cacheData
  const get = await Caching.getCache(CKey)
  if (!get) {
    await Caching.setCache(CKey, JSON.stringify(cacheData), 'EX', '10') // 10 sec
  }
  return get
}

// ProjectName + Key = CacheName
export const getCacheDataCallService = async (key = 'CACHE_DATA_CALL_SERVICE_') => {
  // cache by user details
  const cacheResponse = await Caching.getCache(key)
  if (cacheResponse) {
    return JSON.parse(cacheResponse)
  }
  return undefined
}

// ProjectName + Key = CacheName
export const setCacheDataCallService = async (data, key = 'CACHE_DATA_CALL_SERVICE_', time) => {
  await Caching.setCache(key, JSON.stringify(data), 'EX', time)
}
