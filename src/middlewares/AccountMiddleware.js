// import { WALLETS } from '../enum/index.js'
import { REGISTERS, USERSIMAGES } from '../enum/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB, updateOne } from '../libs/mongo.js'
import { getDataResponse } from '../messages/index.js'
import { verifyChangePassword, changePassword } from '../controllers/loginController.js'

export const GetUserInfo = () => async (ctx, next) => {
  try {
    const { id, status, twofactor_secret, isTradeAllowed, allowed_trade_currencies, reference_key, hasWallet, uni_level_reference_key, ...info } = ctx.findUser
    // //const { data: wallet, db: walletDB } = (await findAllDB({ reference_key }, WALLETS)) || {}

    // //info.wallets = wallet.map(v => ({ wallet_reference: v.wallet_reference, balance: v.balance + '', coin: v.coin }))
    // info['referral_link_left'] = reference_key + '_L'
    // info['referral_link_right'] = reference_key + '_R'
    ctx.responseData = info
    // //walletDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'GetUserInfo')
  }
}

export const updateUserPassword = () => async (ctx, next) => {
  try {
    const language = ctx.language
    const { reference_key } = ctx.findUser
    const { current_password, new_password } = ctx.request.body
    const macAddress = ctx.userMacAddress
    const ip = ctx.ip
    const { data: user, db: userDB } = (await findOneDB({ reference_key, status: 'ACTIVE' }, REGISTERS)) || {}
    if (!user) {
      userDB.close()
      return (ctx.body = await getDataResponse(ctx.language, 'AUTH_LOGIN_FAILURE', {}))
    }

    const { password } = user || {}
    if (!password) return (ctx.body = await getDataResponse(ctx.language, 'AUTH_LOGIN_FAILURE', { password: 'password not found.' }))
    const isVerify = await verifyChangePassword(current_password, password)
    if (!isVerify) return (ctx.body = await getDataResponse(language, 'INVALID_CURRENT_PASSWORD', { param: 'current_password' }))

    await changePassword(new_password, reference_key, password, macAddress, ip)

    userDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'updateUserPassword')
  }
}

export const updateUserForgotPassword = () => async (ctx, next) => {
  try {
    const { new_password, email } = ctx.request.body
    const macAddress = ctx.userMacAddress
    const ip = ctx.ip
    const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') }, status: 'ACTIVE' }, REGISTERS)) || {}
    if (!user) {
      userDB.close()
      return (ctx.body = await getDataResponse(ctx.language, 'AUTH_LOGIN_FAILURE', {}))
    }
    const { password, reference_key } = user || {}
    if (!password) return (ctx.body = await getDataResponse(ctx.language, 'AUTH_LOGIN_FAILURE', { password: 'password not found.' }))
    await changePassword(new_password, reference_key, password, macAddress, ip)

    userDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'updateUserForgotPassword')
  }
}

export const accountInfoUpload =
  (type = 'ACCOUNT_INFO', status = 'ACTIVE') =>
  async (ctx, next) => {
    try {
      const language = ctx.language
      const { reference_key } = ctx.findUser

      if (!ctx.imageUrl) return (ctx.body = await getDataResponse(language, 'UPLOAD_FAILED', { form_data: 'image url not found.' }))
      const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key, type }, { reference_key, type, url: ctx.imageUrl, status }, USERSIMAGES)) || {}

      updatedUserDB.close()
      ctx.userImageDetails = { url: ctx.imageUrl, type, status }
      return next()
    } catch (error) {
      throw throwError(error, 'accountInfoUpload')
    }
  }
