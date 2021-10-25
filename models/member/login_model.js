// check if the user login data is right

const db = require('../connection_db')

module.exports = function memberlogin(memberData) {
    let result = {}
    return new Promise((resolve, reject) => {
        // check if user login data can be found in database
        db.query('SELECT * FROM member WHERE email = ? AND password = ?', [memberData.email, memberData.password],
                function(err, rows){
                    if(err) {
                        result.status = "Login fail.",
                        result.err = "Server error, try agin.",
                        reject(result)
                        return
                    }
                    resolve(rows)
                })
    })
}