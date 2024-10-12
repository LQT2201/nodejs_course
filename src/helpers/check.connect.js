const { default: mongoose } = require("mongoose")

// count connect 
const countConnect = () => {
    const numConnect =  mongoose.connections.length
    console.log("Number of connection::" + numConnect)
}

module.exports = { 
    countConnect
}