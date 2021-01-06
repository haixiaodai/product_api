var mongoose = require('mongoose');
require('../db');

const ProductSchema=  new mongoose.Schema({
    barcode:{
        type: String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        default:"https://publichax.s3-ap-southeast-2.amazonaws.com/No-image-available.png"
    },
    sales:[{
        type: mongoose.Schema.ObjectId,
        ref:"Sales"
    }],
    stock:{
        type:Boolean,
        required:true
    }
})

module.exports = mongoose.model("Products", ProductSchema);