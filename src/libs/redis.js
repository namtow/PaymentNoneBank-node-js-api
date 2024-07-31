const env = process.env.NODE_ENV || 'development'
import config from 'config'
import redis from 'redis'
import moment from 'moment'
import chalk from 'chalk'

const redisEnv = config.get('redis')
const { url, host, port } = redisEnv || {}
const client = !url ? redis.createClient(port, host, { detect_buffers: true }) : redis.createClient(url, { detect_buffers: true })

client.on('error', function (err) {
  console.log(chalk.red(moment.utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC+00:00' + ' Redis error: ' + err))
})

class Chaching {
  async setCache(key, value, expire = 'EX', timer = '10800') {
    // expire 2 type (EX (seconds), PX (milliseconds)) // 10800 = 3houses.
    client.set(key, value, expire, timer)
  }

  async setCacheExpireNone(key, value) {
    client.set(key, value)
  }

  async getCache(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, reply) => {
        if (err) reject(err)
        resolve(reply)
      })
    })
  }

  async flushallRedis() {
    return client.flushdb(async (err, succeeded) => console.log('Flush all redis is: ' + succeeded))
  }

  async deleteKeyCache(key) {
    console.log('redis delete key: ' + key)
    return client.del(key)
  }

  async getOneKeys(key) {
    return new Promise((resolve, reject) => {
      client.keys(`*${key}*`, (err, keys) => {
        if (err) reject(err)
        resolve(keys)
      })
    })
  }

  async flushOneRedis(key) {
    return new Promise((resolve, reject) => {
      client.del(key, (err, del) => {
        if (err) reject(err)
        resolve(del)
      })
    })
  }
}

export default new Chaching()
