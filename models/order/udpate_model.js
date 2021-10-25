const db = require('../connection_db')

// receive updateOrderData from controller
/**
 * updateOrderData : {
 *   orderID : 1
 *   memberID : 1
 *   productID : 2
 *   quantity : 10
 *   updateDate : 2021-10-13
 * }
 */



module.exports = function updateOrder( updateOrderData ) {
    result = {}
    return new Promise ( async ( resolve, reject ) => {
        const dataExist = await checkOrderData(updateOrderData.orderID, updateOrderData.memberID, updateOrderData.productID)
        const dataComplete = await checkOrderIsComplete(updateOrderData.orderID, updateOrderData.memberID, updateOrderData.productID)

        if( dataExist === false) {
            result.ststus = "Update order fail."
            result.err = "Can not find the order"
            reject(result)
        }
        if( dataComplete === false) {
            result.ststus = "Update order fail."
            result.err = "Can not update order, order has completed."
            reject(result)
        }


        const price = await getProductPrice( updateOrderData.productID )
        const orderPrice = updateOrderData.quantity * price

        await db.query('UPDATE order_list SET order_quantity = ?, order_price = ?, update_date = ? WHERE order_id = ? AND member_id = ? AND product_id = ?', [ updateOrderData.quantity, orderPrice, updateOrderData.updateDate, updateOrderData.orderID, updateOrderData.memberID, updateOrderData.productID ], ( err, rows ) => {
            if ( err ) {
                console.log(err)
                result.status = "Update order fail."
                result.err = "Server error, please try again later."
                reject(result)
                return
            }
            result.status = "Update order successfully."
            result.updateOrderData = updateOrderData
            resolve( result )
        })
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