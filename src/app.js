const express = require("express")
const morgan = require("morgan")
const helmet = require('helmet') //Bao mat
const compression = require("compression")
const app = express()

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// init db
require('./dbs/init.mongodb')
const {countConnect} = require('./helpers/check.connect')
// init routes
app.get("/", (req, res, next) => {
    res.status(200).json({
        message:"Welcome to PJ"
    })
})

// handling errors
module.exports = app

