// check email is a correct format

module.exports = class CheckMember {
    // check email's format
    checkEmail (email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        const result = re.test(email)
        return result
    }

    checkFileSize (fileSize) {
        var maxSize = 1 * 1024 *1024 // 1M
        if (fileSize > maxSize) {
            return true
        } 
        return false
    }

    checkFileType (fileType) {
        if (fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
            return true
        }
        return false
    }
}