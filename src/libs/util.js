import decKpg from 'decimal.js'
import crypto from 'crypto'
const { Decimal } = decKpg

export const plus = (input1, input2) => new decKpg(input1).plus(input2).toFixed()
export const minus = (input1, input2) => new decKpg(input1).minus(input2).toFixed()
export const mul = (input1, input2) => new decKpg(input1).mul(input2).toFixed()
export const divided = (input1, input2) => new decKpg(input1).dividedBy(input2).toFixed()

export const objectKeyNotNull = obj =>
  Object.keys(obj).forEach(key => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === 'null' || obj[key] === 'undefined') {
      obj[key] = ''
    } else if (typeof obj[key] === 'number') {
      obj[key] = obj[key] + ''
    }
  })

export const generateChar = (bytes = 20) => crypto.randomBytes(bytes).toString('hex')
