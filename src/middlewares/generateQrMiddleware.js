import { PAY_NON_BANK,GENERATE_AMOUNT } from '../enum/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB,insertOne} from '../libs/mongo.js'
import { getDataResponse } from '../messages/index.js'


export const generateQrPromtpay = () => async (ctx, next) => {
    try {
        // const {userRef, amount } = ctx.query;
        const {amount } = ctx.query;
        if (isNaN(amount) || +amount <= 0) {
            ctx.body = {
                res_code: '0404',
                res_type: 'error',
                res_message: 'Please enter the amount in integer numbers only!!',
                res_data: {},
            }
            return
        }

        // const where = {$and:[{userRef:userRef},{ default:true }]}
        const where = { default:true }
        // console.log({userRef, amount});

        const { data: generateQrCode , db: generateQrRegistDB }= await findOneDB(where,PAY_NON_BANK)
        console.log({generateQrCode})

        if(generateQrCode == null){
            ctx.body = {
                res_code: '0404',
                res_type: 'error',
                res_message: 'User Referent No Correct!!',
                res_data: {},
            }
            return
        }
        

        if(generateQrCode != null){

            if(generateQrCode.default == true ){

                if(amount != '' && amount > 0 ){
                    
                    var random=Math.random().toFixed(2)*100
                    const  Realamount = +`${amount}.${random}`
                    const GenerateQr={
                        userRef:generateQrCode.userRef,
                        nameBank:generateQrCode.nameBank,
                        nameUser:generateQrCode.nameUser,
                        promtpay:generateQrCode.promtpay,
                        amount:+Realamount,
                        url:`https://promptpay.io/${generateQrCode.promtpay}/${+Realamount}`,
                        status:'continue'
                    }
                    console.log({GenerateQr});
                    
                    if(isNaN(GenerateQr.amount)){
                        ctx.body = {
                            res_code: '0404',
                            res_type: 'error',
                            res_message: 'Please enter Amount again OR Not Float !!',
                            res_data: {},
                        }
                        return
    
                    }else{
                        const { data: paypalUser, db: paypalUserDB } = await insertOne(GenerateQr, GENERATE_AMOUNT)
                        ctx.generate=GenerateQr
                        paypalUserDB.close()
                    }
    
                }else{
                        ctx.body = {
                            res_code: '0404',
                            res_type: 'error',
                            res_message: 'Please enter the amount in integer numbers only!!',
                            res_data: {},
                        }
                        return
                }
            }
      
        }
        generateQrRegistDB.close()
        return  next()
        
    } catch (error) {
      throw throwError(error,'generateQrPromtpay ')
    }
  }

  