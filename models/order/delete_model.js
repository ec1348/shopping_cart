const db = require('../connection_db')


/**
 * 
 * @param {object} deleteOrderData -[{orderID: 1, memberID: 1, productID: 2},{orderID: 1, memberID: 1, productID: 2} ]
 * @returns 
 */
module.exports = function deleteOrder( deleteOrderData ) {
    return new Promise( async ( resolve, reject ) => {
        let result = {}

        // loop if more than one data
        for(let key in deleteOrderData){
            const orderID = deleteOrderData[key].orderID
            const memberID = deleteOrderData[key].memberID
            const productID = deleteOrderData[key].productID

            // check if the order exist
            let dataExist = await checkOrderData( orderID, memberID, productID )
            // check if the order already complete
            let dataComplete = await checkOrderIsComplete( orderID, memberID, productID )

            if( dataExist === false){
                result.status = "Delete the order fail."
                result.err = "can not find the order."
                reject(result)
                return
            }
            if( dataComplete === false) {
                result.ststus = "Update order fail."
                result.err = "Can not delete order, order has completed."
                reject(result)

            }
            // database query
            db.query('DELETE FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [ orderID, memberID, productID ], ( err, rows ) =>{
                if( err ) {
                    console.log(err)
                    result.err = "Server error, please try again later."
                    reject(result)
                    return
                }
                result.ststus = "Delete the order successfully."
                result.deleteOrderData = deleteOrderData
                resolve(result)
            })
        }
    })
}

const checkOrderData = function( orderID, memberID, productID ) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ?', [ orderID, memberID, productID ], function ( err, rows ) {
            if( rows[0] === undefined ) {
                resolve(false)        
            } else {
                resolve(true)
            }
        })
    })
}

const checkOrderIsComplete = function( orderID, memberID, productID ) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ? AND product_id = ? AND is_complete = ?', [ orderID, memberID, productID , 0], ( err, rows ) => {
            if( rows[0] === undefined ) {
                resolve(false)        
            } else {
                resolve(true)
            }
        })
    })
}
// get product price
const getProductPrice = ( productID ) => {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT price FROM product WHERE id = ?', productID, ( err, rows ) => {
            if( err ){
                console.log( err )
                reject( err )
                return
            }
            resolve( rows[0].price )
        })
    })
}