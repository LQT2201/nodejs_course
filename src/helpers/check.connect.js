const { default: mongoose } = require("mongoose")

const countConnect = () => {
    const numConnect =  mongoose.connect.length
    console.log("Number of connection::" + numConnect)
}

module.exports = { 
    countConnect
}