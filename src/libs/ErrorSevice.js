import winston from 'winston'
import moment from 'moment'
import fs from 'fs'

import { NotificationErrorService } from './Notification.js'

const dir = './logs/info'
const logPath = `${dir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
const tsFormat = () => new Date().toLocaleTimeString()
const mode = process.env.NODE_ENV === 'production'

if (!fs.existsSync(dir)) {
  // fs.mkdirSync(dir)
  fs.mkdir(dir, { recursive: true }, err => {
    console.log('create folder error: ' + err)
  })
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: logPath,
      level: 'info',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
      timestamp: tsFormat
    })
  ]
})

const ErrorFormat = error => {
  const devError = {
    res_code: error.status || error.statusCode || 500,
    res_type: 'error',
    res_stack: error.stack,
    res_message: error.message,
    res_data: {}
  }
  const prodError = {
    res_code: '500',
    res_message: 'Server error.',
    res_data: {}
  }
  if (mode) {
    NotificationErrorService(`ErrorStack -> ${error.stack}`)
  }
  return {
    devError,
    prodError
  }
}

export const ErrorService = error => {
  const { devError, prodError } = ErrorFormat(error)
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`
  logger.log({
    time: logDateTime,
    level: 'info',
    ...devError
  })
  const resError = mode ? prodError : devError
  return resError
}

export const addErrorApi = result => {
  if (mode)
    logger.log({
      level: 'info',
      ...result
    })
}

export const addError = error => {
  const { devError } = ErrorFormat(error)
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`
  if (mode)
    logger.log({
      time: logDateTime,
      level: 'info',
      ...devError
    })
  else return console.log(error)
}

export const throwError = (error, key) => {
  const throwDir = './logs/error'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'error',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })

  throwLogs.log({
    time: logDateTime,
    level: 'error',
    key,
    error: error.message
  })

  return error
}

export const throwErrorStellar = error => {
  const throwDir = './logs/stellar'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`

  if (!fs.existsSync(throwDir)) {
    // fs.mkdirSync(dir)
    fs.mkdir(throwDir, { recursive: true }, err => {
      console.log('create folder error: ' + err)
    })
  }
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'error',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })

  throwLogs.log({
    time: logDateTime,
    level: 'error',
    error: error
  })

  return error
}

export const throwErrorServices = error => {
  const throwDir = './logs/services'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`

  if (!fs.existsSync(throwDir)) {
    // fs.mkdirSync(dir)
    fs.mkdir(throwDir, { recursive: true }, err => {
      console.log('create folder error: ' + err)
    })
  }
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'error',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })

  throwLogs.log({
    time: logDateTime,
    level: 'error',
    error: error
  })

  return error
}

export const writeScheduleRestartServer = (message, key) => {
  const throwDir = './logs/restart'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'info',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })
  throwLogs.log({
    time: logDateTime,
    level: 'info',
    key,
    message
  })

  return message
}

export const responseLogsCallMicroServiceWithdraw = (info, module) => {
  const throwDir = './logs/thirdparty/responses'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`

  if (!fs.existsSync(throwDir)) {
    // fs.mkdirSync(dir)
    fs.mkdir(throwDir, { recursive: true }, err => {
      console.log('create folder error: ' + err)
    })
  }
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'info',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })

  throwLogs.log({
    time: logDateTime,
    level: 'info',
    info: {
      module,
      info
    }
  })

  return info
}

export const throwErrorCallMicroServiceWithdraw = error => {
  const throwDir = './logs/trading-core'
  const throwLogPath = `${throwDir}/${moment().utcOffset('+07:00').format('YYYY-MM-DD')}.log`
  const logDateTime = `${moment().utcOffset('+07:00').format('HH:mm:ss:SSS')} +07:00 GMT`

  if (!fs.existsSync(throwDir)) {
    // fs.mkdirSync(dir)
    fs.mkdir(throwDir, { recursive: true }, err => {
      console.log('create folder error: ' + err)
    })
  }
  const throwLogs = winston.createLogger({
    time: logDateTime,
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: throwLogPath,
        level: 'error',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
      })
    ]
  })

  throwLogs.log({
    time: logDateTime,
    level: 'error',
    error: error
  })

  return error
}
