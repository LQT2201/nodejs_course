const mongoose = require("mongoose");

const connectString = 'mongodb://127.0.0.1:27017/shopDEV';

mongoose.connect(connectString)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Enable Mongoose debug mode based on the condition
if (1 === 0) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}

module.exports = mongoose;


