const verifyToken = require('../../models/verification')
const order_to_db = require('../../models/order/order_to_db')
const updateOrder = require('../../models/order/udpate_model')
const deleteOrder = require('../../models/order/delete_model')
const completeOrder = require('../../models/order/complete_model')

module.exports = class ModifyOrder {
    // Order
    postOrder( req, res, next ) {
        const token = req.headers['token']

        if(token === null) {
            res.json({
                err: "No token detected."
            })
        } else {
            verifyToken(token).then(tokenResult => {
                if (tokenResult === false){
                    res.json({
                        result:{
                            status:"Token is not valid.",
                            err: "Please login again."
                        }
                    })
                } else {
                    const memberID = tokenResult
                    const orderList = {
                        memberID: memberID,
                        productID: req.body.productID,
                        quantity: req.body.quantity,
                        orderDate: onTime()
                    }
                    order_to_db(orderList).then(result => {
                        res.json({
                            result: result
                        })
                    }, err =>{
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    putOrder( req, res, next ){
        const token = req.headers['token']

        if(token === null) {
            res.json({
                err: "No token detected."
            })
        } else {
            verifyToken(token).then(tokenResult => {
                if (tokenResult === false){
                    res.json({
                        result:{
                            status:"Token is not valid.",
                            err: "Please login again."
                        }
                    })
                } else {
                    const orderID = req.body.orderID
                    const memberID = tokenResult
                    const productID = req.body.productID

                    const updateOrderData = {
                        orderID: orderID,
                        memberID: memberID,
                        productID: productID,
                        quantity: req.body.quantity,
                        updateDate: onTime()
                    }
                    updateOrder(updateOrderData).then(result => {
                        res.json({
                            result: result
                        })
                    }, err =>{
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    deleteOrder( req, res, next ){
        const token = req.headers['token']

        if(token === null) {
            res.json({
                err: "No token detected."
            })
        } else {
            verifyToken(token).then(tokenResult => {
                if (tokenResult === false){
                    res.json({
                        result:{
                            status:"Token is not valid.",
                            err: "Please login again."
                        }
                    })
                } else {
                    const orderID = req.body.orderID
                    const memberID = tokenResult
                    const productID = req.body.productID.replace(" ","")
                    const splitProductID = productID.split(',')

                    let deleteOrderData = []

                    for( let i = 0; i < splitProductID.length; i++ ){
                        deleteOrderData.push({orderID: orderID, memberID: memberID, productID: splitProductID[i]})
                    }

                    deleteOrder(deleteOrderData).then(result => {
                        res.json({
                            result: result
                        })
                    }, err =>{
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
    completeOrder( req, res, next){
        const token = req.headers['token']

        if(token === null) {
            res.json({
                err: "No token detected."
            })
        } else {
            verifyToken(token).then(tokenResult => {
                if (tokenResult === false){
                    res.json({
                        result:{
                            status:"Token is not valid.",
                            err: "Please login again."
                        }
                    })
                } else {
                    const orderID = req.body.orderID
                    const memberID = tokenResult

                    completeOrder( orderID,memberID ).then( result => {
                        res.json({
                            result: result
                        })
                    }, err =>{
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
}

const onTime = () =>{
    const date = new Date();
    const mm = date.getMonth();
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();
  
    return [date.getFullYear(), "-" +
          (mm > 9 ? '' : '0') + mm, "-" +
          (dd > 9 ? '' : '0') + dd, " " +
          (hh > 9 ? '' : '0') + hh, ":" +
          (mi > 9 ? '' : '0') + mi, ":" +
          (ss > 9 ? '' : '0') + ss
      ].join('')
  }