// Get all the products from db

const db = require('../connection_db')

module.exports = function getAllProductData(memberData) {
    let result = {};
    return new Promise ((resolve, reject) => {
        db.query('SELECT * FROM product', (err, rows) =>{
            // if server error
            if(err) {
                console.log(err)
                result.status = "Get products fail."
                result.err = "Server error, please try again later."
                reject(result)
                return
            }
            // get the data from db successfully. Return data
            resolve(rows)
        })
    })
}
