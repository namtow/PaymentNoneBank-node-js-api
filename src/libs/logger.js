/**
 * Module dependencies.
 */

import Counter from 'passthrough-counter'
import humanize from 'humanize-number'
import bytes from 'bytes'
import chalk from 'chalk'
import moment from 'moment'

import { addErrorApi } from './ErrorSevice.js'

/**
 * Color map.
 */

const colorCodes = {
  7: 'magenta',
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green',
  0: 'yellow'
}

/**
 * Development logger.
 */

export const loggerRes = opts => {
  return async function logger(ctx, next) {
    // request
    const start = Date.now()
    console.log('  ' + chalk.gray('-->') + ' ' + chalk.bold('%s') + ' ' + chalk.gray('%s') + ' ' + chalk.cyan(moment().utcOffset('UTC+07:00').format('YYYY-MM-DD HH:mm:ss')) + ' ' + chalk.gray('+7:00 TH'), ctx.method, ctx.originalUrl)

    try {
      await next()
    } catch (err) {
      // log uncaught downstream errors
      log(ctx, start, null, err)
      throw err
    }

    // calculate the length of a streaming response
    // by intercepting the stream with a counter.
    // only necessary if a content-length header is currently not set.
    const length = ctx.response.length
    const body = ctx.body
    let counter
    if (length == null && body && body.readable) {
      ctx.body = body.pipe((counter = Counter())).on('error', ctx.onerror)
    }

    // log when the response is finished or closed,
    // whichever happens first.
    const res = ctx.res

    const onfinish = done.bind(null, 'finish')
    const onclose = done.bind(null, 'close')

    res.once('finish', onfinish)
    res.once('close', onclose)

    function done(event) {
      res.removeListener('finish', onfinish)
      res.removeListener('close', onclose)
      log(ctx, start, counter ? counter.length : length, null, event)
    }
  }
}

/**
 * Log helper.
 */

const log = (ctx, start, len, err, event) => {
  // get the status code of the response
  const status = err ? (err.isBoom ? err.output.statusCode : err.status || 500) : ctx.status || 404

  // set the color of the status code;
  const s = (status / 100) | 0
  const color = colorCodes.hasOwnProperty(s) ? colorCodes[s] : 0

  // get the human readable response length
  let length
  if (~[204, 205, 304].indexOf(status)) {
    length = ''
  } else if (len == null) {
    length = '-'
  } else {
    length = bytes(len).toLowerCase()
  }

  const upstream = err ? chalk.red('xxx') : event === 'close' ? chalk.yellow('-x-') : chalk.gray('<--')

  const timeStart = time(start)
  const results = getResults(ctx, timeStart)
  addErrorApi(results)
  console.log('  ' + upstream + ' ' + chalk.bold('%s') + ' ' + chalk.gray('%s') + ' ' + chalk[color]('%s') + ' ' + chalk.gray('%s') + ' ' + chalk.gray('%s'), ctx.method, ctx.originalUrl, status, timeStart, length)
}

/**
 * Show the response time in a human readable format.
 * In milliseconds if less than 10 seconds,
 * in seconds otherwise.
 */

const time = start => {
  const delta = Date.now() - start
  return humanize(delta < 10000 ? delta + 'ms' : Math.round(delta / 1000) + 's')
}

function getResults(ctx, timeStart) {
  var connection = ctx.req.connection
  // ctx.response
  return {
    method: ctx.req.method,
    url: ctx.req.url,
    statusCode: ctx.res.statusCode,
    responseTime: timeStart,
    headers: ctx.req.headers,
    body: ctx.request.body,
    remoteAddress: connection && connection.remoteAddress,
    remotePort: connection && connection.remotePort
  }
}
