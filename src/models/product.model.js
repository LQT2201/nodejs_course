const mongoose = require('mongoose'); 
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    product_name:{type:String, required:true},
    product_thumb:{type:String, required:true},
    product_description:String,
    product_price:{type:Number, required:true},
    product_type:{type:String, required:true, enum:['Electronics', 'Clothing','Funiture']},
    product_shop:String,
    product_attributes:{type:mongoose.Schema.Types.Mixed, required:true},
},{
    timestamps:true,
    collection: COLLECTION_NAME
});


//define the product type = Clothing

const clothingSchema = new mongoose.Schema({
    brand:{type:String, required:true},
    size: String,
    material:String
},{
    collection:'clothes',
    timestamps:true 
})

const electronicSchema = new mongoose.Schema({
    brand:{type:String, required:true},
    size: String,
    material:String
},{
    collection:'clothes',
    timestamps:true 
})


//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronics: mongoose.model('Electronics', electronicSchema)
}