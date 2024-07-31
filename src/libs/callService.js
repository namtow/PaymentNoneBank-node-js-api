import fetch from 'node-fetch'
import { encode_without_async } from '../libs/base64.js'
import config from 'config'
export const callServiceCheckStatus = async ({ endpoint, username: basicAuthUser, password: basicAuthPassword }) => {
  const basicAuth = encode_without_async(basicAuthUser + ':' + basicAuthPassword)
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    'Accept-Language': 'EN',
    'Content-Type': 'application/json'
  }
  const response = await fetch(`${endpoint}/version`, {
    method: 'GET',
    headers
  })
    .then(async response => {
      const result = await response.json()
      if (result.res_code !== '0000') return { checker: false, result }
      return { checker: true, result }
    })
    .catch(error => {
      return { checker: false, result: error }
    })

  return response
}


const api=config.get("testCallAPI")

export const callServiceTest = async (data) => {

  const endpoint="http://192.168.1.36:53200/api/v1/english_town/generate_tag"
  const basicAuth = encode_without_async(api.username + ':' + api.password)
  console.log({basicAuth});
  const headers = {
    Authorization: `Basic ${basicAuth}`,
    'Accept-Language': 'EN',
    'Content-Type': 'application/json'
  }

const body=JSON.stringify(data)
  const response = await fetch(`${endpoint}`, {
    method: 'POST',
    headers,
    body
  })
    .then(async response => {
      const result = await response.json()
      console.log({result});
      if (result.res_code !== '0000') return { checker: false, result }
      return { checker: true, result }
    })
    .catch(error => {
      return { checker: false, result: error }
    })

  return response
}

export const callService365paypal = async (data) => {

  const endpoint="https://liza888.com/paypal365"

  const body=JSON.stringify(data)
  const response = await fetch(`${endpoint}`, {
    method: 'POST',
    body
  })
    .then(async response => {
      const result = await response.json()
      console.log({result});
      if (result.res_code !== '0000') return { checker: false, result }
      return { checker: true, result }
    })
    .catch(error => {
      return { checker: false, result: error }
    })

  return response
}