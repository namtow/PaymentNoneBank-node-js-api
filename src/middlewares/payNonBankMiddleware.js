import { AMOUNT_PROMTPAY, PAY_NON_BANK, LOGIN_REGISTER } from '../enum/index.js'
import { throwError } from '../libs/index.js'
import { findOneDB, insertOne, updateOne, countAllCollectionDB, findAllDBPagination,findAllDBSortLimit} from '../libs/mongo.js'
import { getDataResponse } from '../messages/index.js'


export const getDashBoardPromtpay = () => async (ctx, next) => {
  try {
    const { token } = ctx.request.headers
    const { data: getPromtpay, db: getPromtpayDB } = await findOneDB({ token }, LOGIN_REGISTER)
    console.log({ getPromtpay })

    if (getPromtpay == null) {
      console.log('No Data !!')
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No User !!.',
        res_data: {}
      }
      return
    } else {
      const userId = getPromtpay._id.toString()
      const where = { userRef: userId }
      console.log({ where })
      const { page, perPage } = ctx.query  
    
      if (!page || (page && isNaN(page))) {
        ctx.status = 400
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'No query page !!.',
          res_data: {}
        }
        return
      }
      if (!perPage || (perPage && isNaN(perPage))) {
        ctx.status = 400
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'No query perPage !!.',
          res_data: {}
        }
        return
      }
     
      const { data: getAmountPromtpay, db: getAmountPromtpayDB } = await findAllDBPagination(where,{ updated_at :-1 } ,+perPage,+page, PAY_NON_BANK)
      //const { data: getAmountPromtpay, db: getAmountPromtpayDB } = await findAllDBSortLimit(where,{ updated_at :-1 } ,0, PAY_NON_BANK)
      console.log({ getAmountPromtpay })
      

      
      const { data: getCountPromtpay, db: getCountPromtpayDB } = await countAllCollectionDB(where, PAY_NON_BANK)
      console.log({getCountPromtpay});

      if (getAmountPromtpay != null) {
        const getDashBoard = getAmountPromtpay.map(v => {
          return {
            nameBank: v.nameBank,
            nameUser: v.nameUser,
            promtpay: v.promtpay,
            phoneAlert: v.phoneAlert,
            totalAmount: v.totalAmount,
            count: v.count
          }
        })

        ctx.getDashboardAmount = {
          dataCount:getCountPromtpay,
          page:+page,
          perPage:+perPage,
          data:getDashBoard

        }
        
        

      } else {
        console.log('No Data !!')
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'No Data !!.',
          res_data: {}
        }
        return
      }
      getAmountPromtpayDB.close();
      getCountPromtpayDB.close();
    }
    
    getPromtpayDB.close();
    
    return next()
    
  } catch (error) {
    throw throwError(error, 'transectionPromtpay')
  }
}

//getTransectionPromtpay 
export const getTransectionPromtpay = () => async (ctx, next) => {
  try {
    const { token } = ctx.request.headers
    const { data: getTransection, db: getTransectionDB } = await findOneDB({ token }, LOGIN_REGISTER)
    console.log({ getTransection })

    if (getTransection == null) {
      console.log('No Data !!')
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No Data user!!.',
        res_data: {}
      }
      return
    }

    const id = getTransection._id.toString()
    const where1 = { userRef: id }

    const { data: checkTransection, db: checkTransectionDB } = await findOneDB(where1, PAY_NON_BANK)
    console.log({ checkTransection })

    if (checkTransection == null) {
      console.log('No Data !!')
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No Data Promptpay!!.',
        res_data: {}
      }
      return
    }

    console.log(checkTransection.userRef)
    const userId = checkTransection.userRef.toString()
    const where2 = { refUser: userId }
    console.log({ where2 })
    
    const { startDate, endDate, searchBank,page,perPage } = ctx.query //เรียกดู ข้อมูลที่ต้องเสิร์ท
    
    
      if (!page || (page && isNaN(page))) {
        ctx.status = 400
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'No query page !!.',
          res_data: {}
        }
        return
      }
      if (!perPage || (perPage && isNaN(perPage))) {
        ctx.status = 400
        ctx.body = {
          res_code: '0404',
          res_type: 'error',
          res_message: 'No query perPage !!.',
          res_data: {}
        }
        return
      }
    
    const { data: getAmountTransection, db: getAmountTransectionDB } = await findAllDBPagination(where2,  { updated_at :-1 } ,+perPage,+page,AMOUNT_PROMTPAY)
    const { data: getCountAllPromtpay, db: getCountAllPromtpayDB } = await countAllCollectionDB(where2, AMOUNT_PROMTPAY)
    
   
    const whereDate = { updated_at: { $gte: startDate, $lte: endDate } }
    console.log({ whereDate })

    const whereBank = { nameBank: searchBank }
    console.log({ whereBank })
    console.log({ searchBank })

    const whereAll = { $and: [{ updated_at: { $gte: startDate, $lte: endDate } }, { nameBank: searchBank }] }
    console.log({ whereAll })

    const { data: getAmountDate, db: getAmountDateDB } = await findAllDBPagination(whereDate,{ updated_at :-1 } ,+perPage,+page, AMOUNT_PROMTPAY)
    const { data: getCountDatePromtpay, db: getCountDatePromtpayDB } = await countAllCollectionDB(whereDate, AMOUNT_PROMTPAY)

    const { data: getAmountBankpromptpay, db: getAmountBankpromptpayDB } = await findOneDB(whereBank, AMOUNT_PROMTPAY)
    

    const { data: getAmountBankAll, db: getAmountBankAllDB } = await findAllDBPagination(whereAll,{ updated_at :-1 } ,+perPage,+page, AMOUNT_PROMTPAY)
    const { data: getCountBankAllPromtpay, db: getCountBankAllPromtpayDB } = await countAllCollectionDB(whereAll, AMOUNT_PROMTPAY)

    if (startDate != endDate && getAmountBankpromptpay != null) {
      console.log({ getAmountBankAll })
      const transectionAmountAll = getAmountBankAll.map(v => {
        return {
          updated_at: v.updated_at,
          nameUser: v.nameUser,
          nameBank: v.nameBank,
          amount: v.amount
        }
      })
     
      ctx.transectionGet = {
        dataCount:getCountBankAllPromtpay,
        page:+page,
        perPage:+perPage,
        data:transectionAmountAll
      }
      
    } else if (startDate != endDate ) {

      if(!startDate || !endDate){
        return (ctx.body = await getDataResponse('EN', 'NOT_DATE_DEFAULT', {}))

      }
      console.log({ getAmountDate })
      const transectionAmountDate = getAmountDate.map(v => {
        return {
          updated_at: v.updated_at,
          nameUser: v.nameUser,
          nameBank: v.nameBank,
          amount: v.amount
        }
      })
     
      ctx.transectionGet = {
        dataCount:getCountDatePromtpay,
        page:+page,
        perPage:+perPage,
        data:transectionAmountDate
      }

    } else if (getAmountBankpromptpay != null) {
      const { data: getAmountBank, db: getAmountBankDB } = await findAllDBPagination(whereBank,{ updated_at :-1 } ,+perPage,+page, AMOUNT_PROMTPAY)
      console.log({ getAmountBank })
      const { data: getCountBankPromtpay, db: getCountBankPromtpayDB } = await countAllCollectionDB(whereBank, AMOUNT_PROMTPAY)
      
      const transectionAmountBank = getAmountBank.map(v => {
        return {
          updated_at: v.updated_at,
          nameUser: v.nameUser,
          nameBank: v.nameBank,
          amount: v.amount
        }
      })
      
      ctx.transectionGet = {
        dataCount:getCountBankPromtpay,
        page:+page,
        perPage:+perPage,
        data:transectionAmountBank
      }
      getAmountBankDB.close()
      getCountBankPromtpayDB.close()

    } else if (startDate == endDate && searchBank == '') {
      console.log({ getAmountTransection })
      const transectionAmount = getAmountTransection.map(v => {
        return {
          updated_at: v.updated_at,
          nameUser: v.nameUser,
          nameBank: v.nameBank,
          amount: v.amount
        }
      })
     
      ctx.transectionGet  = {
        dataCount:getCountAllPromtpay,
        page:+page,
        perPage:+perPage,
        data:transectionAmount

      } 

    } else {
      ctx.transectionGet  
    }
    
    
    getCountBankAllPromtpayDB.close()
    getAmountBankAllDB.close()
    getAmountBankpromptpayDB.close()
    getCountDatePromtpayDB.close()
    getAmountDateDB.close();
    getCountAllPromtpayDB.close();
    getAmountTransectionDB.close();
    checkTransectionDB.close();
    getTransectionDB.close();

    return next()
  } catch (error) {
    throw throwError(error, 'transectionPromtpay')
  }
}


/*export const transectionPromtpay = () => async (ctx, next) => {
  try {
    console.log('generateQrPromtpay for Transection!!')
    const { token } = ctx.request.headers
    const { promtpay, amount } = ctx.request.body

    const { data: getPromtpay, db: getPromtpayDB } = await findOneDB({ token }, LOGIN_REGISTER)
    console.log({ getPromtpay })

    if (getPromtpay == null) {
      ctx.body = {
        res_code: '0404',
        res_type: 'error',
        res_message: 'No User!!',
        res_data: {}
      }
      return
    } else {
      const userId = getPromtpay._id.toString()
      const where = { $and: [{ userRef: userId }, { promtpay: promtpay }] }

      const { data: getAmountPromtpay, db: getAmountPromtpayDB } = await findOneDB(where, PAY_NON_BANK)
      console.log(getAmountPromtpay)

      if (promtpay == getAmountPromtpay.promtpay) {
        console.log('Amount wait...')

        if (amount > 0) {
          const transection = {
            idRef: getAmountPromtpay._id.toString(),
            refUser: getPromtpay._id.toString(),
            nameUser: getAmountPromtpay.nameUser,
            nameBank: getAmountPromtpay.nameBank,
            amount: amount
          }
          const { data: insertAmountPromtpay, db: insertAmountPromtpayDB } = await insertOne(transection, AMOUNT_PROMTPAY)
          console.log(insertAmountPromtpay)
          ctx.insertAmount = transection
          getAmountPromtpayDB.close()
          insertAmountPromtpayDB.close()

          //update amount

          if (getAmountPromtpay.count == null) {
            const dashBorad = {
              totalAmount: amount,
              count: count + 1
            }
            console.log({ dashBorad })
            const { data: updateAmount, db: updateAmountDB } = await updateOne(where, dashBorad, PAY_NON_BANK)
            updateAmountDB.close()
          } else {
            const dashBorad = {
              totalAmount: getAmountPromtpay.totalAmount + amount,
              count: getAmountPromtpay.count + 1
            }
            console.log({ dashBorad })
            const { data: updateAmount, db: updateAmountDB } = await updateOne(where, dashBorad, PAY_NON_BANK)
            updateAmountDB.close()
          }
        } else {
          console.log('Amount is Wrong')
          ctx.body = {
            res_code: '0404',
            res_type: 'error',
            res_message: 'Amount No correct',
            res_data: {}
          }
          return
        }
      }
    }
    getPromtpayDB.close()
    return next()
  } catch (error) {
    throw throwError(error, 'generateQrPromtpay ')
  }
}*/