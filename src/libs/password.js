import hasPassword from 'password-hash'

export const passwordVerify = (value, hashValue) => hasPassword.verify(value, hashValue)

export const isHashedPassword = value => hasPassword.isHashed(value)

export const generatePassword = value => hasPassword.generate(value)

export const generateSha256 = value => hasPassword.generate(value, { algorithm: 'sha256' })
