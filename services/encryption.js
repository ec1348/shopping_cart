const crypto = require('crypto')

module.exports = function cryptoPassword(password) {
    // encrypt password
    let hashPassword = crypto.createHash('sha1')
    hashPassword.update(password)
    const encryptedPassword = hashPassword.digest('hex')
    return encryptedPassword
}