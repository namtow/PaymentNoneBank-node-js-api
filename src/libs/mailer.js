const env = process.env.NODE_ENV || 'development'
import config from 'config'
import nodemailer from 'nodemailer'
import Mailgun from 'mailgun-js'
import { throwError } from './ErrorSevice.js'

const mail = config.get('mail')
const { host, port, service, email, password } = mail
class Mailer {
  constructor() {
    this.service = service
    this.host = host
    this.port = port
    this.emailLength
    this.emailCount = 0
    this.email
    this.password
    this.mailgun = new Mailgun({ apiKey: mail.apiKey, domain: mail.domain, host: 'api.eu.mailgun.net', timeout: 180000 })
  }

  init() {
    this.email = email
    this.password = password
  }

  async sendMail(message) {
    if (env === 'production') {
      return await this.api(message)
    } else {
      return await this.smtp(message)
    }
  }

  async smtp(message) {
    const transporter = nodemailer.createTransport({
      service: this.service,
      host: this.host,
      port: this.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.email,
        pass: this.password
      },
      logger: false, // default is false,
      connectionTimeout: 180000
    })

    message.from = `Project Koajs Mongo Setup ${this.email}`

    await transporter.verify()

    const info = await transporter
      .sendMail(message)
      .then(info => info)
      .catch(error => {
        console.log('Something wrong in sendMail : ', error)
      })

    return info
  }

  async api(message) {
    message.from = `Project Koajs Mongo Setup <${this.email}>`

    return await this.mailgun
      .messages()
      .send(message)
      .then(() => {
        return { from: message.from }
      })
      .catch(err => {
        console.log('Mailer -> api -> err', err)
        throwError(err, 'MailerAPI')
        return false
      })
  }
}

export default new Mailer()
