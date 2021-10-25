// receive the orderId, memberID from controller
const config = require('../../config/development_config')
const db = require('../connection_db')
const transport = require('../connection_mail')

module.exports = function completeOrder( orderID, memberID ) {
    return new Promise( async ( resolve, reject ) => {
        result = {}
        // check if order exist
        const orderExist = await checkOrderData( orderID, memberID )
        // check if order complete
        const orderComplete = await checkOrderIsComplete( orderID )

        if( orderExist === false ) {
            result.status = "Complete the order fail."
            result.err = "Can not find the order."
            reject(result)
            return
        }
        if( orderComplete === false ) {
            result.status = "Complete the order fail."
            result.err = "Order has completed."
            reject(result)
            return
        }
        // get order product ID and quantity
        const orderData = await getOrderData( orderID, memberID )
        // const productID = orderData[0].order_id

        // check if stock is enough
        for ( let key in orderData ) {
            const hasStock = await checkOrderStock( orderData[key].product_id, orderData[key].order_quantity )
            if( hasStock !== true ) {
                result.status = "Complete the order fail."
                result.err = hasStock
                reject(result)
                return
            }
        }

        // deduct stock number from db
        await db.query('UPDATE product, order_list SET product.stock_quantity = product.stock_quantity - order_list.order_quantity WHERE order_list.product_id = product.id AND order_list.order_id = ?', orderID, ( err, rows ) => {
            if( err ) {
                console.log( err )
                result.status = "Complete the order fail"
                result.err = "Server error, please try again later."
                reject(result)
                return
            }  
        })
        
        // make order complete, change is_complete value to 1
        await db.query('UPDATE order_list SET is_complete = 1 WHERE order_id = ?', orderID, ( err, rows ) => {
            if( err ) {
                console.log( err )
                result.status = "Complete the order fail"
                result.err = "Server error, please try again later."
                reject(result)
                return
            }  
        })
        // send the confirm email
        const memberData = await getMemberData( memberID )
        console.log(memberData)
        const email = memberData[0].email
        const name = memberData[0].name

        const mailOptions = {
            from: `"Test name cake store" <${config.senderMail.user}>`,
            to: email,
            subject: name + " [Your order has completed]",
            html: `<p>Hi, ${name} </p>` + `<br>` + `<br>` + `<span> Thanks for your order from <b>test name cake store</b>, we hope to serve you again soon! </span>`
        }

        transport.sendMail( mailOptions, ( err, info ) => {
            if( err ) {
                return console.log(err)
            }
            console.log("Message %s sent: %s", info.messageId, info.response)
        })
        result.status = "Order id: " + orderID + " payment accomplished, thanks for using our service! Order detail will be send to " + email
        resolve(result)

    })
}

// check if order exist
const checkOrderData = function( orderID, memberID) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ?', [ orderID, memberID ], function ( err, rows ) {
            if( rows[0] === undefined ) {
                resolve(false)        
            } else {
                resolve(true)
            }
        })
    })
}

// check if order complete
const checkOrderIsComplete = function( orderID ) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT is_complete FROM order_list WHERE order_id = ?', orderID, ( err, rows ) => {
            if( rows[0].is_complete === 1 ) {
                resolve(false)        
            } else {
                resolve(true)
            }
        })
    })
}

// get order product ID and quantity
const getOrderData = function( orderID, memberID ) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM order_list WHERE order_id = ? AND member_id = ?', [ orderID, memberID ], ( err, rows ) => {
            // console.log("Get order data: ", rows)
            resolve(rows)
        })
    })
}

// get member data
const getMemberData = function( memberID ) {
    return new Promise( ( resolve, reject ) => {
        db.query('SELECT * FROM member WHERE id = ?', memberID, (err, rows ) => {
        if( err ) {
            console.log( err )
            result.status = "Complete the order fail"
            result.err = "Server error, please try again later."
            reject(result)
            return
        }
        resolve(rows)
    })
    })
}

// check if stock is enough
const checkOrderStock = function( orderProductID, orderProductQuantity ) {
    return new Promise ( ( resolve, reject ) => {
        db.query('SELECT * FROM product WHERE id = ?', orderProductID, ( err , rows ) => {
            // console.log("Get product data: ", rows)
            if( rows[0].stock_quantity >= orderProductQuantity && rows[0].stock_quantity !== 0){
                resolve(true)
            }else {
                resolve(rows[0].name + " no stock.")
            }
        })
    })
}

