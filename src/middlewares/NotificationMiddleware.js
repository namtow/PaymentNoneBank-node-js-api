import { NOTIFICATION, REGISTERS, NOTIFICATIONKEYS } from '../enum/index.js'
// import { getCacheDataCallService, setCacheDataCallService } from '../controllers/cachingController.js'
import { throwError } from '../libs/index.js'
import { findAllDBSortLimit, findAllAndUpdate, findOneDB, deleteAllFind, insertMany } from '../libs/mongo.js'
import { getDataResponse } from '../messages/index.js'
import { ObjectID } from 'mongodb'
// import { getDataResponse } from '../messages/index.js'

export const notificationLists = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const { reference_key } = ctx.findUser
    const { isRead, type, limit, order } = ctx.params

    // const whereFilter = type === 'SPOT' ? { type: { $in: ['bullish'] } } : { type: { $in: ['bullish', 'bearish'] } }
    const whereFilter = { reference_key }
    if (type !== 'ALL_ACTION') {
      whereFilter['type'] = type
    }
    if (+isRead === 0) {
      whereFilter['isRead'] = false
    } else if (+isRead === 1) {
      whereFilter['isRead'] = true
    }
    const { data: notification, db: notificationDB } = (await findAllDBSortLimit(whereFilter, { created_at: order === 'DESC' ? -1 : 1 }, limit, NOTIFICATION)) || {}
    ctx.lists = notification.map(v => {
      const { reference_key, ...total } = v || {}
      return total
    })
    notificationDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'notificationLists')
  }
}

export const readAllNotification = () => async (ctx, next) => {
  try {
    const { reference_key } = ctx.findUser
    await findAllAndUpdate({ reference_key, isRead: false }, { isRead: true }, NOTIFICATION)

    const { data: notification, db: notificationDB } = (await findAllDBSortLimit({ reference_key, isRead: false }, { created_at: -1 }, 20, NOTIFICATION)) || {}
    ctx.lists = notification.map(v => {
      const { reference_key, ...total } = v || {}
      return total
    })
    notificationDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'readAllNotification')
  }
}

export const pushNotification = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const { reference_key, topic, message, type, keys } = ctx.request.body
    const { data: userData, db: userDb } = (await findOneDB({ reference_key }, REGISTERS)) || {}
    if (!userData) {
      userDb.close()
      return (ctx.body = await getDataResponse(language, 'ACCESS_TOKEN_IS_NOT_TRUE', { message: 'reference_key is not found.' }))
    }

    const { data: keysData, db: keysDb } = (await findOneDB({ keys }, NOTIFICATIONKEYS)) || {}
    if (!keysData) {
      keysDb.close()
      return (ctx.body = await getDataResponse(language, 'ACCESS_TOKEN_IS_NOT_TRUE', { message: 'keys is not found.' }))
    }

    // notification
    insertMany([{ reference_key, topic, message, type, isRead: false }], NOTIFICATION)
    userDb.close()
    keysDb.close()
    ctx.responseMessage = { topic, message, type }
    return next()
  } catch (error) {
    throw throwError(error, 'pushNotification')
  }
}

export const detailAllNotification = () => async (ctx, next) => {
  try {
    const { id } = ctx.params
    try {
      ObjectID(id)
    } catch (error) {
      ctx.detail = {}
      return next()
    }
    const { data: notification, db: notificationDB } = (await findOneDB({ _id: ObjectID(id) }, NOTIFICATION)) || {}
    ctx.detail = notification || {}
    notificationDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'detailAllNotification')
  }
}

export const readOneNotification = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const { id } = ctx.params
    try {
      ObjectID(id)
    } catch (error) {
      return (ctx.body = await getDataResponse(language, 'GET_DATA_NOT_FOUND', { param: 'id is not found.' }))
    }
    await findAllAndUpdate({ _id: ObjectID(id), isRead: false }, { isRead: true }, NOTIFICATION)

    const { data: notification, db: notificationDB } = (await findOneDB({ _id: ObjectID(id) }, NOTIFICATION)) || {}
    ctx.detail = notification || {}
    notificationDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'readOneNotification')
  }
}

export const deleteAllNotification = () => async (ctx, next) => {
  try {
    const { reference_key } = ctx.findUser
    await deleteAllFind({ reference_key }, NOTIFICATION)

    const { data: notification, db: notificationDB } = (await findAllDBSortLimit({ reference_key, isRead: false }, { created_at: -1 }, 20, NOTIFICATION)) || {}
    ctx.lists = notification.map(v => {
      const { reference_key, ...total } = v || {}
      return total
    })
    notificationDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'deleteAllNotification')
  }
}
