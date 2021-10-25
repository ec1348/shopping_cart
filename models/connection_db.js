// Connect to Database

const config = require('../config/development_config')
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
})

connection.connect(err=>{
    if(err){
        console.log(err)
    } else{
        console.log("Connect to Database")
    }
})

module.exports = connection