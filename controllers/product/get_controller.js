const productData = require('../../models/product/getAllProduct_model')

module.exports = class GetProduct {
    // get all the product
    getAllProduct(req, res, next){
        productData().then(result => {
            res.json({
                result: result
            })
        }, (err) => {
            res.json({
                result: err
            })
        }
        )
    }
}