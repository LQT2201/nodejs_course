const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

const shopSchema = new Schema({
    name:{
        type: String,
        maxLength:150,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type: String,
        enum:['active','inactive'],
        default:'inactive'
    },
    verify:{
        type:Boolean,
        default:false
    },
    roles:{
        type: Array,
        default:[]
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, shopSchema);