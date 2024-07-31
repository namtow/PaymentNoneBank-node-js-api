import { Base64 } from 'js-base64'

export const encode = string => {
  return Base64.encode(string)
}

export const decode = async base64string => {
  return Base64.decode(base64string)
}

export const encode_without_async = string => {
  return Base64.encode(string)
}
