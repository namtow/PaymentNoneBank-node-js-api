import { startMongodb } from '../libs/mongo.js'

export const startMongoDB = async () => {
  return await Promise.all([startMongodb()])
}
