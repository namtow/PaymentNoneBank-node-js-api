import router from 'koa-router'
import { registerMiddleware, getDataLoginRegister, UserLoginMiddleware, getInfoData, responseTokenRegister } from '../middlewares/loginMiddleware.js'
import { addUserPromtpay, getProfilePromtpay, deleteUserPromtpay,updateDefaultUserPromtpay } from '../middlewares/AccoutUpdateMiddleware.js'
import { generateQrPromtpay } from '../middlewares/generateQrMiddleware.js'
import { getDataResponse } from '../messages/index.js'
import {getSMSregister} from '../middlewares/smsGetData.js'
import { basicAuthentication } from '../middlewares/AuthenticationMiddleware.js'
import { getDashBoardPromtpay, getTransectionPromtpay } from '../middlewares/payNonBankMiddleware.js'
import moment from 'moment'

const Router = new router()

Router.get('/', getDataLoginRegister(), async ctx => {
  const data = ctx.data
  ctx.body = data
})
//registerCreate
Router.post('/register', basicAuthentication(), registerMiddleware(), async ctx => {
  const dataRegister = ctx.cerateDataRegister
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataRegister)
})

//login
Router.post('/', basicAuthentication(), UserLoginMiddleware(), async ctx => {
  const dataToken = ctx.responseUser //create var รับข้อมูลมา
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataToken)
})

//getInfoUser
Router.get('/getInfoUser', basicAuthentication(), getInfoData(), async ctx => {
  const dataInfo = ctx.getInfoData
  ctx.body = await getDataResponse('EN', 'GET_DATA_SUCCESS', dataInfo)
})

// add Promtpay
Router.post('/add/promtpay', basicAuthentication(), addUserPromtpay(), async ctx => {
  const dataUpdate = ctx.DataUpdateProfile
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataUpdate)
})
// Del Promtpay
Router.delete('/delete/promtpay', basicAuthentication(), deleteUserPromtpay(), async ctx => {
  // ctx.body= "Delete Success!!  "
  ctx.body = await getDataResponse('EN', 'DELETE_DATA_SUCCESS', {})
})

//getAmount DashBoard
Router.get('/amount/dashboard', basicAuthentication(), getDashBoardPromtpay(), async ctx => {
  const dataAmount = ctx.getDashboardAmount
  ctx.body = await getDataResponse('EN', 'GET_DATA_SUCCESS', dataAmount)
})

//getAmount Transection
Router.get('/amount/transection', basicAuthentication(), getTransectionPromtpay(), async ctx => {
  const dataTransectionAmount = ctx.transectionGet
  ctx.body = await getDataResponse('EN', 'GET_DATA_SUCCESS', dataTransectionAmount)
})

//getProfile
Router.get('/profile/promtpay', basicAuthentication(), getProfilePromtpay(), async ctx => {
  const dataPromptpay = ctx.getDataProfile
  ctx.body = await getDataResponse('EN', 'GET_DATA_SUCCESS', dataPromptpay)
})

//generateQR
Router.post('/generate', basicAuthentication(), generateQrPromtpay(), async ctx => {
  const dataQr = ctx.generate
  //ctx.body= dataQr
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataQr)
})


//post SMS
Router.post('/sms/:id', basicAuthentication(),getSMSregister(), async ctx => {
    
  console.log('sms_data', ctx.request.body)
  const dataSms=ctx.responseSms
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataSms)
})

Router.put('/default', basicAuthentication(),updateDefaultUserPromtpay(), async ctx => {
  const defaultData=ctx.updateDefault
  ctx.body = await getDataResponse('EN', 'UPDATE_DATA_SUCCESS', defaultData)
})

Router.get('/generate/paypal',basicAuthentication(),generateQrPromtpay(), 
//generateDataAmountPromtpay(),
async ctx => {
  const dataPaypal =  ctx.generate;
  console.log({dataPaypal});
  const thisTime_UTC = moment().utc();
  const thisTime_TH = moment(thisTime_UTC)
    .set('hour', moment(thisTime_UTC).get('hour') + 7)
    .format('DD/MM/YYYY hh:mm a')
  const thisTime = thisTime_TH
  
  ctx.set('Content-Type', 'text/plain');
  ctx.type = 'html';
  ctx.status = 200;
  ctx.body = ` 
  <!DOCTYPE html>
  <html
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
  >
    <head>
      <title> </title>
  
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
  
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Kanit:wght@200;500;700&display=swap"
        rel="stylesheet"
      />
    </head>
  
    <body style="font-family: 'Kanit', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; padding: 0 12px;">
      <div
        style="
          width: 650px;
          max-width: 100%;
          margin: auto;
          box-shadow: 0px 8px 16px rgb(0 0 0 / 25%);
          border-radius: 4px;
        "
      >
        <div style="background-color: #103566; margin: 8px; text-align: center;">
          <img   src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2Fthai-qr-payment.png?alt=media&token=c965cb07-56cc-493e-8a8e-e55c64628947" style="width: 150px;"/>
      </div>
  
        <div style="padding: 16px">
          <!-- <div style="margin: 18px 0">
            <img
              style="height: 42px; width: auto"
              src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/englishnatvaravik%2Fimages%2Fvn-logo.png?alt=media&token=0732fd06-6786-4214-b4ab-64c6405f1c8e"
            />
          </div> -->
  
          <div
            style="
              min-height: 40vh;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              font-size: 13px;
              color: #212529;
            "
          >
            <div style="text-align: center;">
              <div style="line-height: 2; font-weight: 400;">
                รหัส QR นี้จะแสดงบนเว็บไซต์เท่านั้น หากบุคคลทั่วไปส่งรหัส
                <br>
                QR นี้เพื่อขอรับการชำระเงิน โปรดระวังการฉ้อโกง
              </div>
  
              <div style="color: #FF424F; line-height: 2; font-weight: 400;">
                  โปรดทราบ QR โค้ดนี้ใช้แสกนได้เพียงครั้งเดียวเท่านั้น
                  <br>
                  กดคิวอาร์โค้ดค้างไว้เพื่อบันทึกไปที่รูปภาพ
              </div>
  
              <img src="${dataPaypal.url}" style="max-width: 100%; height: auto; margin: 28px auto 18px auto;"/>
  
              <div>
                <p id="course" style="font-weight: 300;"> ${thisTime}</p>
              </div>
  
              <div style="color: #FF424F; font-weight: 400;">
                รับเงินได้จากทุกธนาคาร
              </div>
  
  
  <div style="padding-top: 0.5rem; padding-bottom: 0.5rem;">
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2FCwi524og.png?alt=media&token=1975df49-d972-4433-a875-10157a523e1e" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2F_ErLY2jM.png?alt=media&token=510d2a9a-af8e-4d0e-bf5a-870d63cb7b14" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2Fmu9jOVRg.png?alt=media&token=0b608198-5121-4816-8570-5e9bdd509d0a" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2FbHOsb2xY.png?alt=media&token=9cdac39c-5588-43fe-85ab-e7b35dd52686" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2F4od-OpqY.png?alt=media&token=9c5ae79c-b30a-4a34-8cba-b7eeb835d62c" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2FmA-oXbYs.png?alt=media&token=fd0a8763-c85b-4b72-b4e4-47d4211963fd" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2FuJsu5IBM.png?alt=media&token=12ffc325-1148-4331-9651-4298161516a2" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2Fx7eUgF-A.png?alt=media&token=2dd561fb-8d2f-41ef-90bc-cba3042a0025" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
                <img src="https://firebasestorage.googleapis.com/v0/b/blubitex-trade.appspot.com/o/365paypal%2Fbank%2F-Zh0VVvE.png?alt=media&token=16c6b643-e0ff-4a51-95f9-81621fbd2565" style="width: 27px; margin: 0 2px; border-radius: 0.25rem; "/>
              </div>
  
              <div style="color: #dc3545; font-size: 18px;">
                THB ${dataPaypal.amount}
              </div>
  
            </div>
  
          </div>
        </div>
  
      </div>
    </body>
  </html>
  
  `;

})
// update Promtpay
// Router.put('/promtpay/:id/update', updateUserPromtpay(), async ctx => {
//   const dataUpdate=ctx.DataUpdateProfile
//   ctx.body = dataUpdate

// })

// // insert Amount
// Router.post('/amount', basicAuthentication(), transectionPromtpay(), async ctx => {
//   const dataUpdate = ctx.insertAmount
//   ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', dataUpdate)
// })
import {callServiceTest,callService365paypal} from "../libs/callService.js"
Router.post('/paypal365',async ctx => {
  // const dataHooks=ctx.upbland
  // console.log({dataHooks});
    const data={
    courseTutorial: [
        {id: 3,name: "Baby Born + Basic Conversation"}, 
    ],
    extendTime: [
        {id: 0,"description": "6 mount"}
    ],
    price: 2990
}
  const resData=await callServiceTest(data)
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', resData)
})

Router.post('/paypal',getSMSregister() ,async ctx => {
  const dataHooks=ctx.upbland
  console.log({dataHooks});

  const resData=await callService365paypal(dataHooks)
  ctx.body = await getDataResponse('EN', 'POST_DATA_SUCCESS', resData)
})

export default Router
