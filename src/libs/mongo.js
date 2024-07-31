const env = process.env.NODE_ENV || 'development'
const mode = process.env.NODE_ENV === 'production'
import { MongoClient } from 'mongodb'
import config from 'config'
import chalk from 'chalk'
import { NotificationErrorService } from './Notification.js'
import moment from 'moment'
const { host, port, username, password, database } = config.get('mongo')

// Connection URI
const uri = `mongodb://${username}:${password}@${host}:${port}`
// const uri = `mongodb://${host}:${port}`
console.log({uri});
export const startMongodb = async () =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, (err, db) => {
        if (err) {
          console.log('Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          dbo.command({ ping: 1 }).then(() => {
            console.log('Database:', chalk.greenBright(database))
            console.log('Url:', chalk.cyan(uri))
            console.log('Mode:', chalk.yellow(dbo.s.options.readPreference.mode))
            console.log('Type:', chalk.greenBright('mongodb'))
            console.log('===================================================')
            db.close()
          })
        }
      })
    } catch (error) {
      console.log('startMongodb Error')
      if (mode) {
        NotificationErrorService(`startMongodb Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const findOneDB = (where, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findOneDB Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          const resData = await dbo.collection(collection).findOne(where)
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('findOneDB Error')
      if (mode) {
        NotificationErrorService(`findOneDB Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const findAllDB = (where, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findAllDB Unable to connect to the mongodb:', err)
          resolve([])
        } else {
          const dbo = db.db(database)
          const resData = await dbo.collection(collection).find(where).toArray()
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('findAllDB Error')
      if (mode) {
        NotificationErrorService(`findAllDB Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const findAllDBGroupBy = (where, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findAllDBGroupBy Unable to connect to the mongodb:', err)
          resolve([])
        } else {
          const dbo = db.db(database)
          const resData = await dbo.collection(collection).distinct('reference_key', where)
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('findAllDBGroupBy Error')
      if (mode) {
        NotificationErrorService(`findAllDBGroupBy Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const countAllCollectionDB = (where, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('countAllCollectionDB Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          const resData = await dbo.collection(collection).countDocuments(where)
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('countAllCollectionDB Error')
      if (mode) {
        NotificationErrorService(`countAllCollectionDB Error -> ${error.stack}`)
      }
      reject(error)
    }
  })
  // insertone
  export const insertOne = (insert, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('insertOne Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          insert['created_at'] = moment.utc().toISOString()
          insert['updated_at'] = moment.utc().toISOString()
          const insertResult = await dbo.collection(collection).insertOne(insert)
          resolve({ data: insertResult, db })
        }
      })
    } catch (error) {
      console.log('insertOne Error')
      if (mode) {
        NotificationErrorService(`insertOne Error -> ${error.stack}`)
      }
      reject(error)
    }
  })



export const insertMany = (insert, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('insertMany Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          insert.map(v => (v['created_at'] = moment.utc().toISOString()))
          const insertResult = await dbo.collection(collection).insertMany(insert)
          resolve({ data: insertResult, db })
        }
      })
    } catch (error) {
      console.log('insertMany Error')
      if (mode) {
        NotificationErrorService(`insertMany Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const updateOne = (find, updateChange, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('updateOne Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          updateChange['updated_at'] = moment.utc().toISOString()
          const updatedResult = await dbo.collection(collection).updateOne(find, { $set: updateChange }, { upsert: true })
          resolve({ data: updatedResult, db })
        }
      })
    } catch (error) {
      console.log('updateOne Error')
      if (mode) {
        NotificationErrorService(`updateOne Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const deleteOne = (findDelete, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('deleteOne Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          const deletedResult = await dbo.collection(collection).deleteOne(findDelete)
          resolve({ data: deletedResult, db })
        }
      })
    } catch (error) {
      console.log('deleteOne Error')
      if (mode) {
        NotificationErrorService(`deleteOne Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const deleteAllFind = (findDelete, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('deleteAllFind Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          const deletedResult = await dbo.collection(collection).deleteMany(findDelete)
          resolve({ data: deletedResult, db })
        }
      })
    } catch (error) {
      console.log('deleteAllFind Error')
      if (mode) {
        NotificationErrorService(`deleteAllFind Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const updateOneBalance = (find, updateChange, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('updateOneBalance Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          const updatedResult = await dbo.collection(collection).updateOne(find, { $set: { updated_at: moment.utc().toISOString() }, $inc: updateChange }, { upsert: true })
          resolve({ data: updatedResult, db })
        }
      })
    } catch (error) {
      console.log('updateOneBalance Error')
      if (mode) {
        NotificationErrorService(`updateOneBalance Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const findAllDBSortLimit = (where, sort, limit, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findAllDBSortLimit Unable to connect to the mongodb:', err)
          resolve([])
        } else {
          const dbo = db.db(database)
          const sortFilter = Object.keys(sort)
          const resData = sortFilter.length
            ? await dbo
                .collection(collection)
                .find(where)
                .sort(sort)
                .limit(+limit)
                .toArray()
            : await dbo
                .collection(collection)
                .find(where)
                .limit(+limit)
                .toArray()
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('findAllDBSortLimit Error')
      if (mode) {
        NotificationErrorService(`findAllDBSortLimit Error -> ${error.stack}`)
      }
      reject(error)
    }
  })

export const findAllAndUpdate = (find, updateChange, collection) =>
  new Promise((resolve, reject) => {
    try {
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findAllAndUpdate Unable to connect to the mongodb:', err)
          resolve(0)
        } else {
          const dbo = db.db(database)
          updateChange['updated_at'] = moment.utc().toISOString()
          const updatedResult = await dbo.collection(collection).updateMany(find, { $set: updateChange })
          resolve({ data: updatedResult, db })
        }
      })
    } catch (error) {
      console.log('findAllAndUpdate Error')
      if (mode) {
        NotificationErrorService(`findAllAndUpdate Error -> ${error.stack}`)
      }
      reject(error)
    }
  })
 

  export const findAllDBPagination = (where, sort, limit, offset, collection) =>
  new Promise((resolve, reject) => {
    try {
      var pageNumber = Math.abs((+offset - 1) * +limit)
      console.log({ where, sort, limit, offset, collection, pageNumber })
      MongoClient.connect(uri, { useUnifiedTopology: true }, async (err, db) => {
        if (err) {
          console.log('findAllDBPagination Unable to connect to the mongodb:', err)
          resolve([])
        } else {
          const dbo = db.db(database)
          const sortFilter = Object.keys(sort)
          console.log({ sortFilter })
          const resData = sortFilter.length
            ? await dbo
                .collection(collection)
                .find(where)
                .skip(pageNumber)
                .limit(+limit)
                .sort(sort)
                .toArray()
            : await dbo
                .collection(collection)
                .find(where)
                .skip(pageNumber)
                .limit(+limit)
                .toArray()
          // console.log({resData});
          resolve({ data: resData, db })
        }
      })
    } catch (error) {
      console.log('findAllDBPagination Error')
      if (mode) {
        NotificationErrorService(`findAllDBPagination Error -> ${error.stack}`)
      }
      reject(error)
    }
  })