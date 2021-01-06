var mongoose = require('mongoose');
require('../db');
var productmodel = require("../model/productmodel");

const SalesSchema=new  mongoose.Schema({
    barcode:{
        type: String,
        required:true,
    },
    sales:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true
    }
});

SalesSchema.post("save",function(doc,next){
    productmodel.findOneAndUpdate({barcode:doc.barcode},{$push:{sales:doc._id}})
        .then(next())
        .catch(error=>{
            next(error)
        });
})

module.exports = mongoose.model("Sales", SalesSchema);