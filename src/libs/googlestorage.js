import fs from 'fs'
import config from 'config'
import moment from 'moment'
import { generateChar } from '../libs/util.js'
import { Storage } from '@google-cloud/storage'
import { throwError } from '../libs/ErrorSevice.js'

const {
  projectId,
  keyFilename,
  storage: { host, bucket: bucketName, path_image: folderPath, location, regional }
} = config.get('google')
const storage = new Storage({
  projectId: projectId,
  keyFilename: 'src/keys_json/' + keyFilename
})

const bucket = storage.bucket(bucketName)

export const initGoogleBucket = async () => {
  try {
    const values = bucket
      .exists()
      .then(data => {
        return { isError: false, data }
      })
      .catch(data => {
        return { isError: true, data: data.errors }
      })
    values.then(v => {
      const { isError, data } = v
      if (isError) {
        throw throwError({ message: data }, 'Google_Bucket')
      } else {
        const [checker] = data
        if (!checker) bucket.create({ location, regional }).then(b => b)
      }
    })
  } catch (error) {
    throw throwError(error, 'Google_Bucket')}
}

const isBucketPathExists = async (userId, uploadType) => {
  const dateFolder = moment().utcOffset('+07:00').format('YYYY-MM-DD')
  const generateFileName = generateChar(16)
  const savePath = `${folderPath}/${uploadType}/${dateFolder}/${userId}_${generateFileName}`
  const urlImage = `${host}/${bucketName}/${savePath}`
  const file = bucket.file(savePath)
  return file
    .exists()
    .then(data => {
      return { isExist: data[0], urlImage, file }
    })
    .catch(err => {
      return { isExist: false, urlImage, file }
    })
}

export const googleUploadImage = async ({ type, path }, userId, uploadType = 'profile', enablePublic = true) => {
  try {
    const { isExist, urlImage, file } = await isBucketPathExists(userId, uploadType)
    if (!isExist) {
      return new Promise((resolve, reject) => {
        fs.createReadStream(path)
          .pipe(
            file.createWriteStream({
              metadata: {
                contentType: type
              }
            })
          )
          .on('error', async err => {
            throwError(err, 'googleUploadImage on error')
            reject(false)
          })
          .on('finish', async () => {
            if (enablePublic) {
              file.makePublic()
            }

            resolve(urlImage)
          })
      })
    } else {
      if (enablePublic) {
        const isPublic = await file.isPublic().then(data => data[0])
        if (!isPublic) await file.makePublic()
      }

      return urlImage
    }
  } catch (err) {
    throwError(err, 'googleUploadImage')
    return false
  }
}

export const deleteFileOnGoogleStorage = async originURL => {
  // Deletes the file from the bucket
  const splitURL = originURL.split(`${host}/${bucketName}/`, 2)
  await bucket.file(splitURL[1]).delete()
}

export const signedURLGoogleStorage = async originURL => {
  const splitURL = originURL.split(`${host}/${bucketName}/`, 2)
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 1 * 60 * 1000 // 1
  }
  const [url] = await storage.bucket(bucketName).file(splitURL[1]).getSignedUrl(options)
  return url
}
