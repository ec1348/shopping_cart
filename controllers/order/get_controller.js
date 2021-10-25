const Check = require('../../services/member_check')
const verifyToken = require('../../models/verification')
const allOrdreData = require('../../models/order/all_order_from_db')
const oneOrdreData = require('../../models/order/one_order_from_db')

check = new Check

module.exports = class GetOrder {
    getAllOrder( req, res, next ) {
        const token = req.headers['token']

        if ( token === null ) {
            res.json({
                err: "Token is not detected."
            })
        } else {
            verifyToken(token).then( tokenResult => {
                if( tokenResult === false ) {
                    res.json({
                        result:{
                            status : "Token is not valid",
                            err: "Please login again"
                        }
                    })
                } else {
                    allOrdreData().then( result => {
                        res.json({
                            result: result
                        })
                    }, err => {
                        res.json({
                            result: err
                        })
                    }
                    )
                }
            })
        }
    }

    getOneOrder( req, res, next) {
        const token = req.headers['token']

        if( token === null ) {
            res.json({
                err: "Token is not detected."
            })
        } else {
            verifyToken( token ).then( tokenResult => {
                if( tokenResult === false ) {
                    res.json({
                        result: {
                            status : "Token is not valid",
                            err: "Please login again"
                        }
                    })
                } else {
                    const memberID = tokenResult
                    oneOrdreData( memberID ).then( result => {
                        res.json({
                            result: result
                        })
                    }, err => {
                        res.json({
                            result: err
                        })
                    })
                }
            })
        }
    }
}