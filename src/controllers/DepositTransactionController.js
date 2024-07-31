import { WALLETCONFIGS, DEPOSITTRANSACTION, WALLETSADDRESS, WALLETS, NOTIFICATION, REGISTERS } from '../enum/index.js'
import { findAllDB, countAllCollectionDB, updateOne, updateOneBalance, findOneDB, insertMany } from '../libs/mongo.js'
import { findAllDbBEP20, countAllCollectionDbBEP20 } from '../libs/mongoDepositBEP20.js'
import { findAllDbERC20, countAllCollectionDbERC20 } from '../libs/mongoDepositERC20.js'
import { findAllDbTRC20, countAllCollectionDbTRC20 } from '../libs/mongoDepositTRC20.js'
import { sendDepositMail } from '../controllers/emailController.js'
import moment from 'moment'

export const solveDetectDepositQueue = async (dateTimeStart, isRecheck, dateOverRecheck) => {
  const { data: walletConfigsData, db: walletConfigsDb } = (await findAllDB(undefined, WALLETCONFIGS)) || {}
  const startDateDay = isRecheck ? moment().startOf('day').add(dateOverRecheck, 'day').toDate() : moment().startOf('day').toDate()
  const endDateDay = moment().startOf('day').add(1, 'day').toDate()

  // for timestamp UNIX
  const startDateDayDetect = moment(startDateDay).unix()
  const endDateDayDetect = moment(endDateDay).unix()
  //   const startDateDayDetect = moment(startDateDay).format('YYYY-MM-DD HH:mm:ss')
  //   const endDateDayDetect = moment(endDateDay).format('YYYY-MM-DD HH:mm:ss')

  for (let index = 0; index < walletConfigsData.length; index++) {
    const { network } = walletConfigsData[index] || {}
    if (!network.length) continue
    const USDT = 'USDT'
    for (let i = 0; i < network.length; i++) {
      const tokenType = `${USDT}_${network[i]}`
      const { data: depositTransactionData, db: depositTransactionDB } = (await countAllCollectionDB({ NameTOKEN: tokenType, createdDate: { $gte: startDateDayDetect, $lt: endDateDayDetect } }, DEPOSITTRANSACTION)) || {}
      const { data: depositServiceData, db: depositServiceDB } = await switchCaseCount(tokenType, { createdDate: { $gte: startDateDayDetect, $lt: endDateDayDetect } })
      if (+depositTransactionData !== +depositServiceData) {
        const { data: findDetect, db: findDetectDB } = (await switchCaseFindOne(tokenType, undefined)) || {}
        if (!findDetect) {
          findDetectDB.close()
          continue
        }

        for (let l = 0; l < findDetect.length; l++) {
          const { _id, ...updateData } = findDetect[l] || {}
          if (!updateData.Transaction_hash) continue

          const { data: filterDuplicateHashData, db: filterDuplicateHashDB } = (await findAllDB({ Transaction_hash: updateData.Transaction_hash }, DEPOSITTRANSACTION)) || {}

          if (!filterDuplicateHashData.length) {
            const { data: updatedAvoidWalletAddress, db: updatedAvoidWalletAddressDB } = (await findOneDB({ coin: USDT, network: network[i], address: updateData.To }, WALLETSADDRESS)) || {}

            const { wallet_reference } = updatedAvoidWalletAddress || {}
            if (!wallet_reference) {
              updatedAvoidWalletAddressDB.close()
              continue
            }

            updateData['createdDateFormat'] = moment(+`${updateData.createdDate}000`).format('YYYY-MM-DD HH:mm:ss')
            updateData['Transaction_timestamp_format'] = moment(+`${updateData.Transaction_timestamp}000`).format('YYYY-MM-DD HH:mm:ss')
            const { data: updatedDepositTransaction, db: updatedDepositTransactionDB } = (await updateOne({ Transaction_hash: updateData.Transaction_hash }, updateData, DEPOSITTRANSACTION)) || {}
            const { data: updatedWalletUser, db: updatedWalletUserDB } = (await updateOneBalance({ wallet_reference, coin: USDT }, { balance: Number(updateData.value_Token) }, WALLETS)) || {}

            const { data: walletData, db: walletDb } = (await findOneDB({ wallet_reference }, WALLETS)) || {}
            if (walletData && walletData.reference_key) {
              // notification
              insertMany([{ reference_key: walletData.reference_key, topic: 'Deposit Successful', message: `You've deposit ${updateData.value_Token} ${USDT} is successfully.`, type: 'DEPOSIT', isRead: false }], NOTIFICATION)

              const { data: user, db: userDB } = (await findOneDB({ reference_key: walletData.reference_key, status: 'ACTIVE' }, REGISTERS)) || {}
              // mail
              if (user && user.email) sendDepositMail({ email: user.email, amount: updateData.value_Token, address: updateData.To, network: network[i], currency_code: USDT })
              userDB.close()
            }

            updatedDepositTransactionDB.close()
            filterDuplicateHashDB.close()
            updatedAvoidWalletAddressDB.close()
            updatedAvoidWalletAddressDB.close()
            updatedWalletUserDB.close()
            walletDb.close()
            continue
          }
          filterDuplicateHashDB.close()
        }
        findDetectDB.close()
      }

      depositTransactionDB.close()
      if (depositServiceDB) depositServiceDB.close()
    }
  }
  walletConfigsDb.close()
}

const switchCaseCount = async (key, where) => {
  switch (key) {
    case 'USDT_BEP20':
      return await countAllCollectionDbBEP20(where, key)
    case 'USDT_ERC20':
      return await countAllCollectionDbERC20(where, key)
    case 'USDT_TRC20':
      return await countAllCollectionDbTRC20(where, key)

    default:
      return { data: false, db: false }
  }
}

const switchCaseFindOne = async (key, where) => {
  switch (key) {
    case 'USDT_BEP20':
      return await findAllDbBEP20(where, key)
    case 'USDT_ERC20':
      return await findAllDbERC20(where, key)
    case 'USDT_TRC20':
      return await findAllDbTRC20(where, key)

    default:
      return { data: false, db: false }
  }
}
