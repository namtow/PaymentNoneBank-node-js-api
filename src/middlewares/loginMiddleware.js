import { throwError } from '../libs/index.js'
import { getDataResponse } from '../messages/index.js'
import {insertOne,findOneDB,findAllDB} from '../libs/mongo.js'
import {LOGIN_REGISTER} from '../enum/index.js'
import {encodeJWTToken,decodeJWTToken} from '../libs/jwt.js'
import bcrypt from "bcrypt";

//registerCreate
export const registerMiddleware = (Language = 'EN')  => async (ctx, next) => {
  try {
    const language = ctx.language ? ctx.language : Language

    const {name,email,password}=ctx.request.body

    ctx.checkBody('name', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
    ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()  
    ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
    ctx.checkBody('email', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 50')).len({max: 50})
    ctx.checkBody('password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
    
    let errors = await ctx.validationErrors()
    if (errors) {
      let error = errors[0]
      error.msg.res_data = { param: error.param }
      return (ctx.body = error.msg)
    }
    //checkData
    const where= {email:email}
    console.log(where);
    const {data:checkData,db:checkDataDB}= await findOneDB(where,LOGIN_REGISTER)
    
    // hash pass to db
    const salt= await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(password, salt);
    

    if(checkData !== null){
      if(email == checkData.email ){
        console.log('Dupicate najaaaaa');
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'email is Dupicate.',
          res_data: {},
      }
      return
      }
  }else{
    console.log("Create New Success !!!!");
    const payload={
      email:email,
      password:newPass
    }
    const dataToken=await encodeJWTToken(payload)
   
    const create={
        name:name,
        email:email,
        password:newPass,
        token:dataToken
    }
    
    const {data:registerCreate,db:responseRegistDB}= await insertOne(create,LOGIN_REGISTER)
    console.log(registerCreate)
    
    ctx.cerateDataRegister=create
    responseRegistDB.close()  

  }
  
  checkDataDB.close()
  return next()
  } catch (error) {
    throw throwError(error,'registerMiddleware')
  }
}

//login
export const UserLoginMiddleware = (Language = 'EN') => async (ctx, next) => {
  try {
    const language = ctx.language ? ctx.language : Language
    ctx.checkBody('password', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
    ctx.checkBody('email', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()  
    ctx.checkBody('email', await getDataResponse(language, 'INVALID_EMAIL_FORMAT')).isEmail()
    let errors = await ctx.validationErrors()
    if (errors) {
      let error = errors[0]
      error.msg.res_data = { param: error.param }
      return (ctx.body = error.msg)
    }
    
    console.log("Login ===>>>");
      const {email,password}=ctx.request.body
      const where={email:email} 
      console.log(email);

      const {data:userLogin,db:responseLoginDB}= await findOneDB(where,LOGIN_REGISTER)
      console.log({userLogin})
     
      if(userLogin != null){
        if(userLogin.email == email){
        
          console.log(true);
          const validPassword = await bcrypt.compare(password,userLogin.password);
          console.log(validPassword);
  
          if(validPassword == true){
            const userLoginSuccess ={
              name:userLogin.name,
              email:userLogin.email,
              token:userLogin.token
            }
            ctx.responseUser=userLoginSuccess
            responseLoginDB.close()
            return next()
  
          }else{
            ctx.body = {
              res_code: '0404',
              res_type: 'error',
              res_message: 'email or password is Wrong.',
              res_data: {},
             }
             return
  
          }

      }
    }else{
          ctx.body = {
            res_code: '0404',
            res_type: 'error',
            res_message: 'email or password is Wrong.',
            res_data: {},
           }
           return

      }

  } catch (error) {
    throw throwError(error, 'UserLoginMiddleware')
  }
}

// getInfoData
export const getInfoData = () => async (ctx, next) => {
  try {
    console.log(ctx.request.header);
    const {token}=ctx.request.header
    
    const where = {token:token}
    console.log({where});
    
    const {data:getUser,db:getRegistDB} = await findOneDB(where,LOGIN_REGISTER)
    console.log({getUser});

   if(getUser != null){
      const getUserProfile={
        name:getUser.name,
        email:getUser.email
      }
    ctx.getInfoData=getUserProfile

   }else{
      ctx.body = {
      res_code: '0404',
      res_type: 'error',
      res_message: 'No data!!',
      res_data: {},
     }
     return
   }
    
   getRegistDB.close()
    return next()
  } catch (error) {
    throw throwError(error,'getInfoData')
  }
}







//getdata
export const getDataLoginRegister = () => async (ctx, next) => {
  try {
    const {data:selectRegister,db:selectDB}=await findAllDB({},LOGIN_REGISTER)
    
    console.log(selectRegister);
    ctx.data=selectRegister
    selectDB.close()
    return next()
  } catch (error) {
    throw throwError(error,'getDataLoginRegister')
  }
}


//token 
export const responseTokenRegister = () => async (ctx, next) => {
  try {
    console.log("Create Token Seccess!!");
    console.log(ctx.request.body);  //ดึงข้อมูลออกมา
    const {username,password}=ctx.request.body
   
    const payload={
        username:username,
        pass:password
    }
    const dataToken=await encodeJWTToken(payload)
    console.log("Token is:"+ dataToken);

    const decode= await decodeJWTToken(dataToken)
    console.log("===", decode);
    ctx.dataRS=payload
    ctx.dataTK=dataToken  //sent to routes
    return next()
  } catch (error) {
    throw throwError(error,'responseTokenRegister')
  }
}



