const mongoose = require("mongoose");
const { countConnect } = require('../helpers/check.connect');
const { db: { host, name, port } } = require('../configs/config.mongodb');

const connectString = `mongodb://127.0.0.1:27017/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    connect() {

        mongoose.connect(connectString)
            .then(() => {
                console.log("Connected to MongoDB successfully! ");
                countConnect();
            })
            .catch(err => {
                console.error("Error connecting to MongoDB: " + err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
