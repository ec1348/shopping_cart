const db = require('../connection_db')

// get order ID : Use Max() syntax to find the maximum order_id from order_list table
const getOrderId = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT MAX(order_id) as id FROM order_list', (err, rows, fields) => {
            if(err){
                console.log(err)
                reject(err)
                return
            }
            resolve(rows[0].id)
        })
    })
}

// get product price
const getProductPrice = (productID) =>{
    return new Promise((resolve, reject) => {
        db.query('SELECT price FROM product WHERE id = ?', productID, (err, rows) => {
            if(err){
                console.log(err)
                reject(err)
                return
            }
            resolve(rows[0].price)
        })
    })
}

module.exports = function save_order_to_DB(orderList) {
    /* get the orderList like :
        orderList = {
            memberID: 7,
            productID: '2, 3, 5',
            quantity: '6, 7, 8',
            orderDate: 2021-10-12
        }
    */
     
    let result = {}
    return new Promise(async (resolve, reject) => {
        // get orderID
        let orderID = await getOrderId() + 1
        // change type to array form str
        const productID_str = orderList.productID
        const productID_Array = productID_str.split(',')
        const quantity_str = orderList.quantity
        const quantity_Array = quantity_str.split(',')

        /**turn two array to object
         * productID_quantity ] {
         *  '2' : 6,
         *  '3' : 7,
         *  '5' : 8
         * }
         */
        var productID_quantity = {}
        productID_Array.forEach((key, value) => productID_quantity[key] = quantity_Array[value])
        // console.log(productID_quantity)
        // Set order data in the right form to save in the db.
        let orderData_all = []
        for (let key in productID_quantity){
            const price = await getProductPrice(key)
            const order_quantity = parseInt(productID_quantity[key])
            const orderData = {
                order_id : orderID,
                member_id : orderList.memberID,
                product_id : key,
                order_quantity : order_quantity,
                order_price : parseInt(price) * order_quantity,
                create_date : orderList.orderDate,
                is_complete : 0
            }
            // save orderData to db
            db.query('INSERT INTO order_list SET ?', orderData, (err, rows) => {
                if(err) {
                    console.log(err)
                    result.err = "Server error, please try again later."
                    reject(result)
                    return
                }
            })
            orderData_all.push(orderData)
        }
        result.status = "Order created successfully."
        result.orderData = orderData_all
        resolve(result)
    })
}