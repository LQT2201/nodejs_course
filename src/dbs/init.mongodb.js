const { default: mongoose, mongo } = require("mongoose")
const {countConnect} = require('../helpers/check.connect')

const connectString = "mongodb://127.0.0.1/shopDEV"

class Database {
    constructor(){
        this.connect()
    }

    connect(type = 'mongodb'){
        if(1 == 1){
            mongoose.set('debug', true)
            mongoose.set('debug',{color:true})
        }

        mongoose.connect(connectString)
            .then(console.log("Connected to MongoDB success!" + countConnect()))
            .catch( err => console.log("Error connect!" + err))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb