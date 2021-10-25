const db = require('../connection_db')

module.exports = function orderFromDB() {
    let result = {}
    return new Promise( (resolve, reject) => {
        db.query('SELECT * FROM order_list', (err, rows) => {
            if( err ) {
                console.log( err )
                result.status = "Get order list fail."
                result.err = "Server error, please try again later."
                reject( result )
                return
            }
            resolve( rows )
        })
    })
}