var express = require("express");
var router = express.Router();
var productmodel = require("../model/productmodel");
var salesmodel = require("../model/salesmodel");

router.get("/:barcode", (req, res, next) => {
    productmodel
        .findOne({barcode: req.params.barcode})
        .populate({
            path:"sales",
            options: {
                sort: { 'date': 1 } }
        })
        .exec()
        .then(result=>{
            if (result){
                if (Array.isArray(result)) {
                    res.status(200).json(result);
                }
                else{
                    var arr=[];
                    arr.push(result);
                    res.status(200).json(arr);
                }
            }
            else{
                res.status(404).json({message:"Product not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message: error.message});
        });
});

router.get("/search/:name", (req, res, next) => {
    productmodel
        .find({name: { "$regex": req.params.name, "$options": "i" }})
        .populate({
            path:"sales",
            options: {
                sort: { date: 1}
            }
        })
        .exec()
        .then(result=>{
            if (result.length>0){
                res.status(200).json(result);
            }
            else{
                res.status(404).json({message:"No product found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message: error.message});
        });
});

router.get("/",(req,res,next)=>{
    productmodel
        .find()
        .populate({
            path:"sales",
            options: {
                sort: { 'date': 1 } }
        })
        .exec()
        .then(result=>{
            res.status(200).json(result);
        });
});

router.post("/",(req,res,next)=>{
    const newpro=productmodel(req.body);
    newpro.save()
        .then(result => {
            res.status(200).json({result})
        })
        .catch(error => {
            res.status(400).json({ message: error.message });
        })
});

router.patch("/:barcode", (req, res, next) => {
    productmodel
        .findOneAndUpdate({barcode:req.params.barcode}, req.body, { new: true })
        .exec()
        .then(result => {
            if (result) {
                return res.status(200).json(result);
            }
            else {
                return res.status(404).json({ message: "Product not found" });
            }
        })
        .catch(error => {
            return res.status(500).json({ message: error.message });
        })
});

router.delete("/:barcode", (req, res, next) => {
    productmodel.findOneAndDelete({barcode:req.params.barcode})
        .exec()
        .then(result=>{
            if(result){
                salesmodel.deleteMany({barcode:req.params.barcode})
                    .then(result=>{
                        if(result) {
                            return res.status(200).json({message: "Delete succeed"});
                        }
                        else{
                            return res.status(500).json({message:"Internal server error"});
                        }
                    })
            }
            else{
                return res.status(404).json({message:"Product not found"});
            }
        })
        .catch(error=>{
            return res.status(500).json({message:"Internal server error"});
        })
});

module.exports = router;