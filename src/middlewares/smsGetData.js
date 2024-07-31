import { AMOUNT_PROMTPAY, PAY_NON_BANK, LOGIN_REGISTER, GENERATE_AMOUNT } from '../enum/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB, insertOne, updateOne } from '../libs/mongo.js'
import { ObjectID } from 'mongodb'
import { plus } from '../libs/util.js'
import { getDataResponse } from '../messages/index.js'
const count = 0
import {callServiceTest,callService365paypal} from "../libs/callService.js"

export const getSMSregister = () => async (ctx, next) => {
  try {
    const msg = ctx.request.body.msg
    const from = ctx.request.body.from
    const id = ctx.request.params.id
    console.log({ msg })
    console.log({ from })
    console.log({ id })

    const { data: user, db: userDB } = await findOneDB({ _id: ObjectID(id) }, LOGIN_REGISTER)
    console.log({ user }) 
    const userId = user._id.toString()
    
    if(user == null){
      return (ctx.body = await getDataResponse('EN', 'NO_DATA_USER', {}))
    }

    var amount
    if (from == 'KBank') {
      
      const myArray = msg.split(' ')
      amount = +`${myArray[5]}` 
      console.log({ amount })

  }else if (from == '027777777') {
      
      const myArray = msg.split(' ')
      amount = +`${myArray[1]}` 
      console.log({ amount })

 
    }else{
        ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'ตรวจสอบข้อมูลเงินเข้าไม่สำเร็จ!!',
        res_data: {}
      }
      return

    }

      const whereAmount = {$and:[{ amount: amount },{status:'continue'}]}
      const { data: findAmountUser, db: findAmountUserDB } = await findOneDB(whereAmount, GENERATE_AMOUNT)
      console.log({ findAmountUser })

      if(findAmountUser==null){
        return (ctx.body = await getDataResponse('EN', 'NO_DATA_DEFAULT', {}))
      }

      if (amount > 0 && amount == findAmountUser.amount) {
        const transection = {
          idRef: findAmountUser._id.toString(),
          refUser: userId,
          nameUser: findAmountUser.nameUser,
          nameBank: findAmountUser.nameBank,
          amount: +amount,
          status:'continue'

        }
        //Math.floor(scbAmount)
        const { data: insertAmountPromtpay, db: insertAmountPromtpayDB } = await insertOne(transection, AMOUNT_PROMTPAY)
        console.log(insertAmountPromtpay)

        //update amount
        const where = {$and:[{ userRef: userId },{promtpay:findAmountUser.promtpay}]}

        const { data: findBankUser, db: findBankUserDB } = await findOneDB(where, PAY_NON_BANK) //หา user id
        console.log({findBankUser});

        if (findBankUser.count == null) {
          //update to amount
          const dashBorad = {
            totalAmount: +amount,
            count: count + 1
          }
          console.log({ dashBorad })
          const { data: updateAmount, db: updateAmountDB } = await updateOne(where, dashBorad, PAY_NON_BANK)
          
          const statusAmount = {
            status:'finish'
          }
          const { data: updateStatus, db: updateStatusDB } = await updateOne( whereAmount,statusAmount, AMOUNT_PROMTPAY)
          const { data: findAmountQrUser, db: findAmountQrUserDB } = await updateOne(whereAmount,statusAmount, GENERATE_AMOUNT)
          
          
          updateStatusDB.close()
          updateAmountDB.close()
          findAmountQrUserDB.close()

        } else {
          const dashBorad = {
            // totalAmount: findBankUser.totalAmount + +amount,
            totalAmount: +plus(findBankUser.totalAmount,amount),
            count: findBankUser.count + 1
            
          }
          console.log({ dashBorad })
          const { data: updateAmount, db: updateAmountDB } = await updateOne(where, dashBorad, PAY_NON_BANK)
          
         
          const statusAmount = {
            status:'finish'
          }
          
          const { data: updateStatus, db: updateStatusDB } = await updateOne( whereAmount,statusAmount, AMOUNT_PROMTPAY)
          const { data: findAmountQrUser, db: findAmountQrUserDB } = await updateOne(whereAmount,statusAmount, GENERATE_AMOUNT)
          
          updateStatusDB.close()
          updateAmountDB.close()
          findAmountQrUserDB.close()
        }

        ctx.responseSms={
          status:'เติมเงินเข้าสำเร็จ',
          data:amount
        }

        ////sent to hooks/////
       
        const whereSuccess={$and:[{ amount: amount },{status:'finish'}]}
        const { data: findAmountSuccess, db: findAmountSuccessDB } = await findOneDB( whereSuccess, AMOUNT_PROMTPAY)
       // console.log({findAmountSuccess});
        ctx.upbland={
          refUser: findAmountSuccess.refUser,
          nameBank: findAmountSuccess.nameBank,
          amount: findAmountSuccess.amount,
          status:findAmountSuccess.status
        }
        console.log('Send to web hooks ',ctx.upbland);
        const datahook = ctx.upbland
        const resData=await callService365paypal(datahook)
        console.log({resData});
        //////////////////////////////////////////////////
        findAmountSuccessDB.close()

        findAmountUserDB.close()
        insertAmountPromtpayDB.close()
        findBankUserDB.close()

      }else{
        ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'ตรวจสอบยอดเงินไม่ถูกต้อง!!',
        res_data: {}
      }
      return
      
    } 

    userDB.close()
    return next()

  } catch (error) {
    throw throwError(error, 'getSMSregister')
  }
}
