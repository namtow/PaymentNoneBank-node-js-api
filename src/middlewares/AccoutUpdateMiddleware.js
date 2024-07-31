
import { LOGIN_REGISTER,PAY_NON_BANK } from '../enum/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB,findAllDB, deleteOne,insertOne,updateOne} from '../libs/mongo.js'
import { ObjectID } from 'mongodb'
import { getDataResponse } from '../messages/index.js'


//AddPromtpay
export const addUserPromtpay = (Language = 'EN') => async (ctx, next) => {
  try {
    const language = ctx.language ? ctx.language : Language
    ctx.checkBody('nameBank', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
    ctx.checkBody('noBank', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty() 
    ctx.checkBody('noBank', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 10')).len({max: 10}) 
    ctx.checkBody('nameUser', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty()
    ctx.checkBody('promtpay', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty() 
    ctx.checkBody('promtpay', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 13')).len({max: 13}) 
    ctx.checkBody('phoneAlert', await getDataResponse(language, 'MISSING_REQUIRED_VALUES')).notEmpty() 
    ctx.checkBody('phoneAlert', await getDataResponse(language, 'CHARACTER_OVER_LENGTH', 'Max Length: 10')).len({max: 10}) 
    
    let errors = await ctx.validationErrors()
    if (errors) {
      let error = errors[0]
      error.msg.res_data = { param: error.param }
      return (ctx.body = error.msg)
    }

    console.log(ctx.request.headers);
    const {token}=ctx.request.headers

    const {data:updatePromtpay,db:updatePromtpayDB}=await findOneDB({token},LOGIN_REGISTER)
    console.log({updatePromtpay});
    
    if(updatePromtpay == null){
        return (ctx.body = await getDataResponse(language, 'UPDATE_DATA_FAILED', {}))
    }

    if(updatePromtpay !== null){
        const {nameBank,noBank,nameUser,promtpay,phoneAlert}=ctx.request.body
        
            const setDataCreateProfile={
              userRef:updatePromtpay._id.toString(),
              nameUser:nameUser,
              noBank:noBank,
              nameBank:nameBank,
              promtpay:promtpay,
              phoneAlert:phoneAlert,
              default:false  
          }
    
              const { data: user, db: userDB } = await insertOne(setDataCreateProfile, PAY_NON_BANK)
             
              console.log({user});
              console.log(setDataCreateProfile);
              ctx.DataUpdateProfile=setDataCreateProfile
              
              userDB.close()
          }
          updatePromtpayDB.close()
          
          return next()
 
  } catch (error) {
    throw throwError(error, 'addUserPromtpay')
  }
}

//set default promtpay
export const updateDefaultUserPromtpay = (Language = 'EN') => async (ctx, next) => {
  try {
    const language = ctx.language ? ctx.language : Language

    const {token}=ctx.request.headers
    const {data:updateCheckUser,db:updateCheckUserDB}=await findOneDB({token},LOGIN_REGISTER)

    if(updateCheckUser == null){
      return (ctx.body = await getDataResponse(language, 'UPDATE_DATA_FAILED', {}))
    }

    if(updateCheckUser != null){
      const id = ctx.query.id
      const {data:checkIdPromtpay,db:checkIdPromtpayDB}=await findOneDB({ _id: ObjectID(id) },PAY_NON_BANK)
      console.log({checkIdPromtpay});

      if(checkIdPromtpay == null){
        return (ctx.body = await getDataResponse(language, 'UPDATE_DATA_FAILED', {}))
      }

      if(checkIdPromtpay != null){
        
        if(checkIdPromtpay.default == false || checkIdPromtpay.default== null){

          const where = {default:true}
          const {data:findPromtpayDefault,db:findPromtpayDefaultDB}=await findOneDB(where,PAY_NON_BANK)
          console.log({findPromtpayDefault});
          const setDefault={
            default:false
          }
          const { data: setDefaultUser, db: setDefaultUserDB } = await updateOne(where,setDefault, PAY_NON_BANK)


          const updateDefault={
            default:true
          }
          const { data: updateDefaultUser, db: updateDefaultUserDB } = await updateOne({ _id: ObjectID(id) },updateDefault, PAY_NON_BANK)
          const {data:returnIdPromtpay,db:returnIdPromtpayDB}=await findOneDB({ _id: ObjectID(id) },PAY_NON_BANK)
          ctx.updateDefault=returnIdPromtpay

          returnIdPromtpayDB.close()
          updateDefaultUserDB.close()
          setDefaultUserDB.close()
          findPromtpayDefaultDB.close()

        }else if(checkIdPromtpay.default == true){
          return (ctx.body = await getDataResponse(language, 'UPDATE_DATA_SUCCESS', checkIdPromtpay))
        }
        
      }
      checkIdPromtpayDB.close()
    }
    
    
    updateCheckUserDB.close()
    return next()
  
  } catch (error) {
    throw throwError(error, 'updateDefaultUserPromtpay')
  }
}

// deletePromtpay
export const deleteUserPromtpay = () => async (ctx, next) => {
  try {
    const {token} = ctx.request.headers
    const id = ctx.query.id
    
    const {data:delPromptpayUser,db:delPromptpayUserDB}=await findOneDB({token},LOGIN_REGISTER)
    console.log({delPromptpayUser});

    if(delPromptpayUser==null){
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No User to Delete!!.',
        res_data: {},
    }
    return

    }
    delPromptpayUserDB.close();

    const { data: user, db: userDB } = await findOneDB({ _id: ObjectID(id) }, PAY_NON_BANK)
    console.log({user});
    userDB.close()

   if(user != null){
      console.log(true);
      
      const {data:deletePromtpay,db:deletePromtpayDB}=await deleteOne({ _id: ObjectID(id) },PAY_NON_BANK)
      console.log("Delete Success!! ",{deletePromtpay});
      deletePromtpayDB.close()
      ctx.body = {
        res_code: '0000',
        res_type: 'success',
        res_message: 'Delete Success!!',
        res_data: {},
    }
    return


    }else{
      console.log("No Deleteddd!!");
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No ID Deleteddd!!.',
        res_data: {},
    }
    return

    }
    
    return next()
    
  } catch (error) {
    throw throwError(error, 'deleteUserPromtpay')
  }
}


//getProfilePromtpay
export const getProfilePromtpay = () => async (ctx, next) => {
    try {
      console.log(ctx.request.headers);
      const {token}=ctx.request.headers
     
      const {data:getProfile,db:GetDB}=await findOneDB({token},LOGIN_REGISTER)
      console.log(getProfile);
      
      if(getProfile != null){
        const userId= getProfile._id.toString()
        const where={userRef:userId}   //ข้อมูลที่เหมือนกันในDB
        const  {data:getProfilePromtpay,db:getPromtpayDB}=await findAllDB(where,PAY_NON_BANK)
        
        if(getProfilePromtpay != null){
          
          // const dataList = getProfilePromtpay.map(v=>{
          //   return {
          //     nameUser:v.nameUser,
          //     noBank:v.noBank,
          //     nameBank:v.nameBank,
          //     promtpay:v.promtpay,
          //     phoneAlert:v.phoneAlert
  
          //   }
          // })
          ctx.getDataProfile=getProfilePromtpay
          getPromtpayDB.close()
           
         }

      }else{
          ctx.body = {
            res_code: '0404',
            res_type: 'error',
            res_message: 'No Profile Promtpay!!.',
            res_data: {},
        }
        return
         }
         
         GetDB.close()
         return next()
      
    } catch (error) {
      throw throwError(error,'getProfilePromtpay')
    }
  }

/*export const updateUserProfile = () => async (ctx, next) => {
  try {
    
    console.log("Update Profile===>");
    console.log(ctx.request.headers);
    const {token}=ctx.request.headers

    
    const {data:resDataRegisterLongin,db:resDataRegisterLonginDB}=await findOneDB({token},LOGIN_REGISTER)
    console.log({resDataRegisterLongin});
    
  
    if(resDataRegisterLongin == null){
        return (ctx.body = await getDataResponse("EN", 'UPDATE_DATA_FAILED', {}))
    }

    if(resDataRegisterLongin !== null){
        console.log(resDataRegisterLongin._id.toString());
        const {fname,lname,email,username,password,promtpay}=ctx.request.body
          //hash password
          const salt= await bcrypt.genSalt(10);
          const newPassword = await bcrypt.hash(password, salt);
        
            const setDataUpdateProfile={
              fname:fname,
              lname:lname,
              email:email,
              username:username,
              pass:newPassword,
              promtpay:promtpay
          }
    
              const { data: user, db: userDB } = await updateOne({token},setDataUpdateProfile, LOGIN_REGISTER)
              console.log("update to==> ",user);
              console.log({setDataUpdateProfile});
              console.log("Update Success!!");
              
              ctx.DataUpdateProfile=setDataUpdateProfile
              userDB.close()
  
  
          }
          resDataRegisterLonginDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'updateUserProfile')
  }
}*/
