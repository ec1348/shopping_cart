const db = require('../connection_db')

module.exports = function register(memberData) {
    let result = {}
    return new Promise((resolve, reject)=>{
        // Check if there is a same email in the database, if yes return error "Email has already registered.", if no save user data to databse.
        // 1. check is there is a same email in the database.
        db.query('SELECT email, name FROM member WHERE email = ?', memberData.email, (err, rows) => {
            // if detect server error return error message "Server error, try again later"
            if (err){
                console.log(err)
                result.status = "Register fail."
                result.err = "Server error, try again later."
                reject(result)
                return
            }
            // if find the same email in the database return {("Rigister fail") , ("Email has already registered")}
            if (rows.length >= 1) {
                result.status = "Register fail."
                result.err = "Email has already registered."
                reject(result)
            } else {
                //save user data to database 
                db.query('INSERT INTO member SET ?', memberData,
                (err, rows)=>{
                    if (err) {
                        console.log(err)
                        result.status = "Register fail"
                        result.err = "Server error, try again later"
                        reject(result)
                        return
                    }
                    result.registerMember = memberData
                    resolve(result)
                })
            }
        }) 
    })
}