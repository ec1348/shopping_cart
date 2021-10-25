const db = require('../connection_db')

module.exports = function getOneOrder(memberID) {
    let result = {}
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM order_list WHERE member_id = ?', memberID, ( err, rows ) => {
            if( err ) {
                console.log(err)
                result.status = "Get order list fail."
                result.err = "Server error, please try again later."
                reject(result)
                return
            }
            resolve(rows)
        })
    }) 
}