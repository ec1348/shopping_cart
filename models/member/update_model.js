const db = require('../connection_db')

module.exports = function customerEdit(id, memberUpdateData) {
    let result = {}
    return new Promise((resolve, reject) => {
        db.query('UPDATE member SET ? WHERE id = ?', [memberUpdateData, id], (err, rows) => {
            if (err) {
                console.log(err)
                result.status = "Updata data fail.",
                result.err + "Server error, please try again later."
                reject(result)
                return
            }
            result.status = "Member data update success."
            result.memberUpdateData = memberUpdateData
            resolve(result)
        })
    })
}