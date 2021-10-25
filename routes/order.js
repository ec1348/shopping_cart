var express = require('express')
var router = express.Router()

const OrderModifyMethod = require('../controllers/order/modify_controller')
const GetOrderMethod = require('../controllers/order/get_controller')

orderModifyMethod = new OrderModifyMethod
getOrderMethod = new GetOrderMethod

// post order router
router.post('/order', orderModifyMethod.postOrder )

// get all order router
router.get('/order', getOrderMethod.getAllOrder )

// get one order router
router.get('/order/member', getOrderMethod.getOneOrder)

// update order router
router.put('/order', orderModifyMethod.putOrder)

// delete order router
router.delete('/order', orderModifyMethod.deleteOrder)

// complete order router
router.put('/order/complete', orderModifyMethod.completeOrder)
module.exports = router