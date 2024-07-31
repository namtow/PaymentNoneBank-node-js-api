const env = process.env.NODE_ENV || 'development'
import fs from 'fs'
import moment from 'moment'
import handlebars from 'handlebars'
import mailer from '../libs/mailer.js'
import { insertMany } from '../libs/mongo.js'
import { EMAILLOG } from '../enum/index.js'

const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
    if (err) {
      callback(err)
      throw err
    } else {
      callback(null, html)
    }
  })
}

export const sendVerificationMail = async (register, isMobile = true) => {
  const { email, verification_code } = register
  const dateNow = moment().format('YYYY-MM-DD; HH:mm:ss')
  const template = isMobile ? 'confirm_register_otp.html' : 'confirm_register.html'
  await readHTMLFile(`public/${template}`, async (err, html) => {
    if (err) return false
    const template = handlebars.compile(html)
    const replacements = {
      verification_code,
      dateNow,
      url: env === 'production' ? 'https://projectkoajsmongosetup.co' : 'https://webdev.projectkoajsmongosetup.co'
    }
    const htmlToSend = template(replacements)
    const mailOptions = {
      to: email,
      subject: 'Please Verify Your Email Address - project-koajs-mongo-setup',
      html: htmlToSend
    }
    const mail = await mailer.sendMail(mailOptions)
    if (mail) {
      const { from } = mail
      await insertMany([{ ...mailOptions, from, status: true }], EMAILLOG)
    }

    return mail
  })
}

export const sendForgotPasswordMail = async (user, typeResetMail) => {
  const { email, verification_code, ip } = user
  const dateNow = moment().format('YYYY-MM-DD; HH:mm:ss')
  const mailTemplate = typeResetMail === 'PASSWORD' ? 'reset_password.html' : 'reset_pin.html'
  await readHTMLFile(`public/${mailTemplate}`, async (err, html) => {
    if (err) return false
    const template = handlebars.compile(html)
    const replacements = {
      email,
      verification_code,
      typeResetMail,
      dateNow,
      ip
    }
    const htmlToSend = template(replacements)
    const mailOptions = {
      to: email,
      subject: `Reset ${typeResetMail} OTP - projectkoajsmongosetup`,
      html: htmlToSend
    }
    const mail = await mailer.sendMail(mailOptions)
    if (mail) {
      const { from } = mail
      await insertMany([{ ...mailOptions, from, status: true }], EMAILLOG)
    }

    return mail
  })
}

export const sendDepositMail = async transaction => {
  const { email, amount, address, network, currency_code } = transaction
  await readHTMLFile('public/deposit_success.html', async (err, html) => {
    if (err) return false
    const template = handlebars.compile(html)
    const replacements = {
      email,
      amount,
      network,
      address,
      currency_code
    }
    const htmlToSend = template(replacements)
    const mailOptions = {
      to: email,
      subject: 'Deposit success - projectkoajsmongosetup',
      html: htmlToSend
    }
    const mail = await mailer.sendMail(mailOptions)
    if (mail) {
      const { from } = mail
      await insertMany([{ ...mailOptions, from, status: true }], EMAILLOG)
    }

    return mail
  })
}

export const sendWithdrawRequestMail = async transaction => {
  const { email, amount, address, network, currency_code, verify_code, nonce, ip } = transaction
  const dateNow = moment().format('YYYY-MM-DD; HH:mm:ss')
  await readHTMLFile('public/withdraw_request.html', async (err, html) => {
    if (err) return false
    const template = handlebars.compile(html)
    const replacements = {
      email,
      amount,
      network,
      address,
      currency_code,
      verify_code,
      nonce,
      dateNow,
      ip
    }
    const htmlToSend = template(replacements)
    const mailOptions = {
      to: email,
      subject: 'Withdraw Transaction Request - projectkoajsmongosetup',
      html: htmlToSend
    }
    const mail = await mailer.sendMail(mailOptions)
    if (mail) {
      const { from } = mail
      await insertMany([{ ...mailOptions, from, status: true }], EMAILLOG)
    }

    return mail
  })
}

export const sendWithdrawSuccessMail = async transaction => {
  const { email, amount, address, network, currency_code } = transaction
  await readHTMLFile('public/withdraw_sucess.html', async (err, html) => {
    if (err) return false
    const template = handlebars.compile(html)
    const replacements = {
      email,
      amount,
      network,
      address,
      currency_code
    }
    const htmlToSend = template(replacements)
    const mailOptions = {
      to: email,
      subject: 'Withdraw Transaction Success - projectkoajsmongosetup',
      html: htmlToSend
    }
    const mail = await mailer.sendMail(mailOptions)
    if (mail) {
      const { from } = mail
      await insertMany([{ ...mailOptions, from, status: true }], EMAILLOG)
    }

    return mail
  })
}
