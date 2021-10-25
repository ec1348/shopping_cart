const toRegister = require('../../models/member/register_models')
const loginAction = require('../../models/member/login_model')
const Check = require('../../services/member_check')
const encryption = require('../../services/encryption')
const jwt = require('jsonwebtoken')
const config = require('../../config/development_config')
const verifyToken = require('../../models/verification')
const updateMemberData = require('../../models/member/update_model')
const formidable = require('formidable')
const fs = require('fs')

check = new Check()

module.exports = class Member {
    postRegister(req, res, next){
        console.log(req.body.name)

        // encrypt password
        const password = encryption(req.body.password)

        // Get client data from client request
        const memberData ={
            name: req.body.name,
            email: req.body.email,
            password: password,
            create_date: onTime()
        }

        // Check email format
        const checkEmail = check.checkEmail(memberData.email)
        // if email doesn't match the Regex (false)
        if (checkEmail === false) {
            res.json({
                result: {
                    status : "Register fail",
                    err: "Please enter correct email format. (123@gmail.com)"
                }
            })
        // if email match the Regex (true) 
        } else {
            // call register model to save data to the database
            toRegister(memberData).then(result => {
                res.json({
                    status: "Success",
                    result: result
                })
            }, (err) => {
                res.json({
                    result: err
                })
            })
        }        
    }

    postLogin(req, res, next){
        const password = encryption(req.body.password)

        const memberData = {
            password: password,
            email: req.body.email
        }

        loginAction(memberData).then(rows => {
            console.log(rows)
            if (rows[0]){
                const token = jwt.sign({
                    algorithm: 'HS256',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: rows[0].id
                }, config.secret)
                res.setHeader('token', token)
                console.log("loging sucessfully.")      
                res.json({
                    status: "Success",
                    result: "Welcome"+ " "+ rows[0].name
                })
            } else{
                res.json({
                    status: "Login fail.",
                    err: "Please enter the correct email and password."
                })
            }
            
        })

    }

    putUpdate(req, res, next){
        const token = req.headers['token']
        if (token === null) {
            res.json({
                err: "No token detected"
            })
        } else {
            verifyToken(token).then(tokenResult => {
                if (tokenResult == false) {
                    res.json({
                        result:{
                            status: "Wrong token",
                            err: "Please login again"
                        }
                    })
                } else {
                    const id = tokenResult
                    const password = encryption(req.body.password)
                    const memberUpdateData = {
                        name : req.body.name,
                        password : password,
                        update_date : onTime()
                    }

                    updateMemberData(id, memberUpdateData).then(result => {
                        res.json ({
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

    putUpdateImage(req, res, next) {
        const form = new formidable.IncomingForm()
        const token = req.headers['token']


        if (token === null) {
            res.json({
                err: "No token detected"
            })
        } else{
            verifyToken(token).then(tokenResult => {
                if (tokenResult == false) {
                    res.json({
                        result:{
                            status: "Wrong token",
                            err: "Please login again"
                        }
                    })
                } else {
                    form.parse( req, async function(err, fields, files) {

                        if(check.checkFileSize(files.file.size) === true) {
                            res.json({
                                result: {
                                    status: "Update image fail.",
                                    err: "Image size shoud smaller than 1 MB."
                                }
                            })
                            return
                        }
            
                        if(check.checkFileType(files.file.type) === true){

                            const image = await fileToBase64(files.file.path)
                            const id = tokenResult
                            const password = encryption(fields.password)

                            // console.log(image, fields.name, password, onTime())
                            const memberUpdateData = {
                                img : image,
                                img_name : fields.name,
                                password : password,
                                update_date : onTime()
                            }
        
                            updateMemberData(id, memberUpdateData).then(result => {
                                res.json ({
                                    result: result
                                })
                            }, err => {
                                res.json({
                                    result: err
                                })
                            })
                        } else {
                            res.json({
                                result: {
                                    status: "Update image fail.",
                                    err: "Please select correct image type. ex: png, jpg, jepg..."
                                }
                            })
                            return
                        }
            
                        
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

const fileToBase64 = (filePath) =>{
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'base64', (err, data) => {
            resolve(data)
        })
    })
}