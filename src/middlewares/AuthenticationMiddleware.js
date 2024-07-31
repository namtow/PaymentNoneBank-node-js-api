const env = process.env.NODE_ENV || 'development'
import basicAuth from 'basic-auth'
import config from 'config'
// import generateKey from 'generate-key'
import macAddress from 'macaddress'
import { getDataResponse } from '../messages/index.js'
import { throwError } from '../libs/index.js'
import { languageProject } from '../libs/language.js'
import { jwtEncodeLogin, userLogin } from '../controllers/loginController.js'
import { findOneDB, insertMany, updateOne } from '../libs/mongo.js'
import { decodeJWTToken } from '../libs/jwt.js'
import { totpVerify } from '../libs/speakeasy.js'
import { REGISTERS, DEVICELOG, IPSPAMLOGINS, USERSIMAGES } from '../enum/index.js'
import pkg from 'uuid'
const { v4: uuidv4 } = pkg
const authen = config.get('auth')

export const basicAuthentication = () => async (ctx, next) => {
  try {
    const language = ctx.request.headers['accept-language']
    if (!language) return (ctx.body = await getDataResponse('EN', 'MISSING_REQUIRED_VALUES', { param: 'Accept-Language', request: 'ctx.language' }))
    const modelLanguage = await languageProject(language)
    let credentials = basicAuth(ctx.req)
    if (!credentials || credentials.name !== authen.username || credentials.pass !== authen.password) {
      ctx.status = 401
      ctx.set('WWW-Authenticate', 'Basic')
      return (ctx.body = await getDataResponse(modelLanguage, 'BASIC_AUTH_FAIL'))
    } else {
      ctx.language = modelLanguage
      return next()
    }
  } catch (error) {
    throw throwError(error, 'basicAuthentication')
  }
}

export const firstToken =
  (loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const ip = ctx.ip
      const firebaseToken = ctx.firebaseToken
      const isMobile = ctx.isMobile
      const userMacAddress = ctx.userMacAddress
      const tokenType = ctx.tokenType

      const { email } = ctx.request.body
      const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') } }, REGISTERS)) || {}
      const { reference_key: referenceKey, refresh_token, refresh_token_mobile } = user
      const refreshToken = isMobile ? refresh_token_mobile : refresh_token
      const token = await jwtEncodeLogin(referenceKey, ip, refreshToken, isMobile, loginType, firebaseToken, userMacAddress, tokenType)
      ctx.token = token
      ctx.isAuth = false

      userDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'firstToken')
    }
  }

export const retrieveMacAddress = () => async (ctx, next) => {
  try {
    macAddress.one((err, mac) => {
      if (err) ctx.userMacAddress = null
      ctx.userMacAddress = mac
    })

    return next()
  } catch (error) {
    throw throwError(error, 'retrieveMacAddress')
  }
}

export const ipAuthLoginFailure = async (user, password, ip, type) => {
  if (ip === '::1' || ip === '127.0.0.1') return
  const { email, uid } = user || {}
  const Text = `user: ${uid || email}, random_password: ${password}`
  insertMany([{ description: Text, ip, type }], IPSPAMLOGINS)
  //   AddListsCloudflare([{ ip, comment: type }])
}

export const PINLogin =
  (loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const isPinLogin = ctx.isPinLogin
      if (!isPinLogin) return next()

      const isMobile = ctx.isMobile
      const firebaseToken = ctx.firebaseToken
      const ip = ctx.ip
      const tokenType = ctx.tokenType
      //   const { pin } = ctx.request.body
      const userId = isPinLogin
      const userMacAddress = ctx.userMacAddress

      const { data: user, db: userDB } = (await findOneDB({ reference_key: userId, status: 'ACTIVE' }, REGISTERS)) || {}
      if (!user) return (ctx.body = await getDataResponse(ctx.language, 'AUTH_LOGIN_FAILURE', {}))

      const { authenticator } = user
      const key = uuidv4().replace(/-/g, '') // web
      const select = {}
      const selector = switchCaseRefreshToken(tokenType)
      select[selector] = key

      const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key: userId }, select, REGISTERS)) || {}
      const token = await jwtEncodeLogin(userId, ip, key, isMobile, loginType, firebaseToken, userMacAddress, tokenType)
      ctx.token = token
      ctx.isAuth = authenticator === 'ACTIVE' ? true : false

      updatedUserDB.close()
      userDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'PINLogin')
    }
  }

export const refreshAccessToken =
  (loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const language = ctx.language
      const token = ctx.request.headers['x-access-token']
      const isMobile = ctx.isMobile
      const firebaseToken = ctx.firebaseToken
      const ip = ctx.ip
      const userMacAddress = ctx.userMacAddress
      const { data: deviceData, db: deviceDB } = (await findOneDB({ access_token: token }, DEVICELOG)) || {}
      if (!deviceData) {
        deviceDB.close()
        return (ctx.body = await getDataResponse(language, 'INVALID_TOKEN', {}))
      }

      const { reference_key, type: token_type } = deviceData || {}
      const { data: user, db: userDB } = (await findOneDB({ reference_key }, REGISTERS)) || {}
      if (!user) return (ctx.body = await getDataResponse(language, 'AUTH_LOGIN_FAILURE', {}))

      const { status } = user
      if (status === 'INACTIVE') return (ctx.body = await getDataResponse(language, 'PLEASE_VERIFY_OTP', {}))

      const key = uuidv4().replace(/-/g, '') // web
      const select = {}
      const selector = switchCaseRefreshToken(token_type)
      select[selector] = key

      const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key }, select, REGISTERS)) || {}
      ctx.token = await jwtEncodeLogin(reference_key, ip, key, isMobile, loginType, firebaseToken, userMacAddress, token_type)

      updatedUserDB.close()
      userDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'refreshAccessToken')
    }
  }

export const accessTokenAuthentication =
  (isPublic = false) =>
  async (ctx, next) => {
    try {
      ctx.tokenType = ctx.request.headers['x-platform']

      const language = ctx.request.headers['accept-language']
      if (!language) return await getDataResponse('EN', 'MISSING_REQUIRED_VALUES', { param: 'accept-language', request: 'language' })

      const modelLanguage = await languageProject(language)
      const token = ctx.request.headers['x-access-token']

      if (!token && isPublic) return next()

      const decode = await decodeJWTToken(token)
      if (!decode) return (ctx.body = await getDataResponse(modelLanguage, 'ACCESS_TOKEN_IS_NOT_TRUE', {}))

      const { key: refreshToken, token_type } = decode
      const { data: deviceData, db: deviceDB } = (await findOneDB({ access_token: token, type: token_type }, DEVICELOG)) || {}
      if (!deviceData) {
        deviceDB.close()
        return (ctx.body = await getDataResponse(modelLanguage, 'ACCESS_TOKEN_IS_NOT_TRUE', {}))
      }
      const tokenType = ctx.tokenType ? (ctx.tokenType === 'IOS' || ctx.tokenType === 'ANDROID' || ctx.tokenType === 'MOBILE' ? 'MOBILE' : 'WEB') : 'WEB'
      if (tokenType !== token_type) return (ctx.body = await getDataResponse(modelLanguage, 'ACCESS_TOKEN_IS_NOT_TRUE', { msg: 'token is not match platform.' }))

      const select = {}
      const selector = switchCaseRefreshToken(token_type)
      select[selector] = refreshToken

      const { data: userData, db: userDb } = (await findOneDB(select, REGISTERS)) || {}
      if (!userData) {
        userDb.close()
        return (ctx.body = await getDataResponse(modelLanguage, 'ACCESS_TOKEN_IS_NOT_TRUE', { message: 'token is not found.' }))
      }
      const { email, invite_reference_key, reference_key, twofactor_secret: twoFactorSecret, authenticator, status, isKYC, hasWallet, isTradeAllowed, allowed_trade_currencies: allowedTradeCurrencies, uni_level_reference_key } = userData || {}
      // get image
      const { data: userImageData, db: userImageDb } = (await findOneDB({ reference_key, type: 'ACCOUNT_INFO' }, USERSIMAGES)) || {}
      const { url: imageURL } = userImageData || {}

      ctx.findUser = {
        email,
        image_url: imageURL || '',
        reference_key,
        invite_reference_key,
        twofactor_secret: twoFactorSecret || '',
        authenticator,
        status,
        isKYC: !!isKYC,
        hasWallet: !!hasWallet,
        isTradeAllowed: !!isTradeAllowed,
        allowed_trade_currencies: !!allowedTradeCurrencies,
        uni_level_reference_key: uni_level_reference_key || ''
      }

      userDb.close()
      deviceDB.close()
      userImageDb.close()
      ctx.language = language

      return next()
    } catch (error) {
      throw throwError(error, 'accessTokenAuthentication')
    }
  }

export const Login =
  (loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const isPinLogin = ctx.isPinLogin
      if (isPinLogin) return next()

      const language = ctx.language
      const isMobile = ctx.isMobile
      const firebaseToken = ctx.firebaseToken
      const ip = ctx.ip
      const { email, password } = ctx.request.body
      const userMacAddress = ctx.userMacAddress
      const tokenType = ctx.tokenType

      const { data: user, db: userDB } = (await findOneDB({ email: { $regex: new RegExp('^' + email.toLowerCase(), 'i') } }, REGISTERS)) || {}
      if (!user) return (ctx.body = await getDataResponse(language, 'AUTH_LOGIN_FAILURE', {}))

      const { status: userStatus, oauth_type: oauthType, password: forgotPasswordFlow } = user
      if (userStatus === 'INACTIVE') return (ctx.body = await getDataResponse(language, 'PLEASE_VERIFY_OTP', {}))
      if (oauthType === 'APPLE' || oauthType === 'FACEBOOK' || (oauthType === 'GOOGLE' && !forgotPasswordFlow)) return (ctx.body = await getDataResponse(language, 'AUTH_LOGIN_FAILURE', { loginType: oauthType }))
      //   // if (oauthType !== 'NONE') return (ctx.body = await getDataResponse(language, 'AUTH_LOGIN_FAILURE', { loginType: oauthType }))

      const data = await userLogin(user, password, ip, 'RANDOM_LOGIN_PASSWORD')
      if (!data) return (ctx.body = await getDataResponse(language, 'AUTH_LOGIN_FAILURE', {}))

      const {
        firstname,
        lastname,
        phone,
        image_url: imageURL,
        invite_reference_key,
        reference_key: referenceKey,
        twofactor_secret: twoFactorSecret,
        authenticator,
        status,
        isKYC,
        hasWallet,
        isTradeAllowed,
        allowed_trade_currencies: allowedTradeCurrencies,
        uni_level_reference_key
      } = data
      if (!isMobile) {
        if (authenticator === 'ACTIVE') {
          if (!ctx.request.headers['x-otp'])
            return (ctx.body = await getDataResponse(language, 'TWOFACTOR_REQUIRED', {
              isAuth: true
            }))

          const token = ctx.request.headers['x-otp']
          const verified = totpVerify(token, twofactor_secret)
          if (!verified) return (ctx.body = await getDataResponse(language, 'TWOFACTOR_IS_NOT_VALID'))
        }
      }
      const key = uuidv4().replace(/-/g, '') // web
      const select = {}
      const selector = switchCaseRefreshToken(tokenType)
      select[selector] = key
      const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key: referenceKey }, select, REGISTERS)) || {}

      const token = await jwtEncodeLogin(referenceKey, ip, key, isMobile, loginType, firebaseToken, userMacAddress, tokenType)
      ctx.token = token
      ctx.isAuth = authenticator === 'ACTIVE' ? true : false
      ctx.findUser = {
        email,
        image_url: imageURL || '',
        reference_key: referenceKey,
        invite_reference_key,
        twofactor_secret: twoFactorSecret || '',
        authenticator,
        status,
        isKYC: !!isKYC,
        //   firstname: kyc ? kyc.firstname || '' : '',
        //   lastname: kyc ? kyc.lastname || '' : '',
        //   phone: kyc ? kyc.phone || '' : '',
        //   country: kyc ? kyc.country || '' : '',
        //   city: kyc ? kyc.city || '' : '',
        //   zipcode: kyc ? kyc.zipcode || '' : '',
        hasWallet: !!hasWallet,
        isTradeAllowed: !!isTradeAllowed,
        allowed_trade_currencies: !!allowedTradeCurrencies,
        uni_level_reference_key: uni_level_reference_key || ''
      }

      userDB.close()
      updatedUserDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'Login')
    }
  }

export const refreshToken =
  (loginType = 'NORMAL') =>
  async (ctx, next) => {
    try {
      const isMobile = ctx.isMobile
      const firebaseToken = ctx.firebaseToken
      const ip = ctx.ip
      const tokenType = ctx.tokenType
      const userMacAddress = ctx.userMacAddress
      const { authenticator, reference_key } = ctx.findUser
      const key = uuidv4().replace(/-/g, '') // web
      const select = {}
      const selector = switchCaseRefreshToken(tokenType)
      select[selector] = key

      const { data: updatedUser, db: updatedUserDB } = (await updateOne({ reference_key }, select, REGISTERS)) || {}
      const token = await jwtEncodeLogin(reference_key, ip, key, isMobile, loginType, firebaseToken, userMacAddress, tokenType)
      ctx.token = token
      ctx.isAuth = authenticator === 'ACTIVE' ? true : false

      updatedUserDB.close()
      return next()
    } catch (error) {
      throw throwError(error, 'refreshToken')
    }
  }

export const switchCaseRefreshToken = tokenType => {
  switch (tokenType) {
    case 'WEB':
      return 'refresh_token'
    case 'MOBILE':
      return 'refresh_token_mobile'
    case 'IOS':
      return 'refresh_token_mobile'
    case 'ANDROID':
      return 'refresh_token_mobile'
    case 'SOCKET':
      return 'refresh_token_socket'
    default:
      return 'refresh_token'
  }
}

export const filterTokenType = tokenType => {
  switch (tokenType) {
    case 'WEB':
      return tokenType
    case 'MOBILE':
      return tokenType
    case 'IOS':
      return 'MOBILE'
    case 'ANDROID':
      return 'MOBILE'
    // case 'IOS':
    //   return tokenType
    // case 'ANDROID':
    //   return tokenType
    case 'SOCKET':
      return tokenType
    default:
      return 'WEB'
  }
}
