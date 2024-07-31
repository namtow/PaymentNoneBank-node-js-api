// npm lib zone
import koa from 'koa'
import json from 'koa-json'
import Router from 'koa-router'
import error from 'koa-json-error'
import helmet from 'koa-helmet'
import koaValidator from 'koa-async-validator'
import ratelimit from 'koa-ratelimit'
import moment from 'moment'
import bodyParser from 'koa-body'
import render from 'koa-ejs'
import { userAgent } from 'koa-useragent'
import env from 'config'
import chalk from 'chalk'
import path from 'path'

// Prefix
import configs from './prefix/index.js'
import cors from '@koa/cors'


// Libs
import { ErrorService, loggerRes } from './libs/index.js'

// Routes
import Version from './routes/Version.js'
import Authentication from './routes/Authentication.js'
import Register from './routes/Register.js'
import Account from './routes/Account.js'
import Notification from './routes/Notification.js'
import login from './routes/login_regis.js'
// Schedules
import './libs/schedule.js'

// Master Data
import { MasterDataCreate } from './libs/MasterDataCreate.js'
import { initGoogleBucket } from './libs/googlestorage.js'
import mailer from './libs/mailer.js'

// controller zone
import { startMongoDB } from './controllers/mongodbController.js'

// database mongo connect
startMongoDB()

// Database Migration - Master data Create
MasterDataCreate().then(data => console.log(data))

// Mailer
mailer.init()

// Google Storage
initGoogleBucket()

// init
const app = new koa()
const router = new Router()
const prefix = configs.service.api
const serverEnv = env.get('server')

// apply rate limit
const rate = new Map()

// using setting
app.use(helmet())
app.use(cors())
app.use(json())
app.use(
  bodyParser({
    multipart: true,
    jsonLimit: '2mb',
    formLimit: '2mb'
  })
)
app.use(userAgent)
app.use(koaValidator())
app.use(loggerRes())
app.use(error(ErrorService))
app.use(
  ratelimit({
    driver: 'memory',
    db: rate,
    duration: 60000, // 1 min
    errorMessage: {
      res_code: '429',
      res_type: 'error',
      res_message: 'Too Many Requests.',
      res_data: {},
      res_time: moment.utc().format()
    },
    id: ctx => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 150, // 150 ip request
    disableHeader: false
    // whitelist: ctx => {
    //   console.log('--------- 1 ---------')
    //   // some logic that returns a boolean
    // },
    // blacklist: ctx => {
    //   console.log('--------- 2 ---------')
    //   // some logic that returns a boolean
    // }
  })
)

app.proxy = true

// ----------------------------------------default-public-first-page-----------------------------------
// set request header
app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': configs.service.allow.origin,
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': configs.service.allow.method,
    'Access-Control-Allow-Headers': configs.service.allow.header
  })
  await next()
})

// set index.html
render(app, {
  root: path.join('public'), // public folder
  layout: 'layout',
  viewExt: 'html',
  cache: false,
  debuf: false
})

// ----------------------------------------router------------------------------------------------------
// first page
router.get('/', async ctx => {
  const Status = [{ server: 'ACTIVE', database: 'ACTIVE' }]
  await ctx.render('index', {
    Status
  })
})

// using routers
router.use(prefix + '/version', Version.routes())
router.use(prefix + '/authenticator', Authentication.routes())
router.use(prefix + '/register', Register.routes())
router.use(prefix + '/account', Account.routes())
router.use(prefix + '/notification', Notification.routes())
router.use(prefix + '/login', login.routes())
app.use(router.routes())
app.use(router.allowedMethods())

// 400 bad request
app.use(async ctx => {
  ctx.status = 404
  ctx.body = {
    res_code: '0404',
    res_type: 'error',
    res_message: 'Unsupported get request.',
    res_data: {},
    res_time: moment.utc().format()
  }
})

// ----------------------------------------server-listen-----------------------------------------------
// start server
const server = app.listen(serverEnv.port || 3000) // listen port:xxxx (default 3000)

console.log(
  `===================================================
Start Server: ${chalk.cyan(serverEnv.host)}:${chalk.cyan(serverEnv.port)}
Deploy Mode: ${chalk.yellow(process.env.NODE_ENV)}
Engine: ${chalk.gray(process.env.NODE_APP_INSTANCE || 'master')}
===================================================`
)

export default server
