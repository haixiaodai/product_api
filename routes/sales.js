var express = require("express");
var router = express.Router();
var salesmodel = require("../model/salesmodel");

router.get("/:barcode", (req, res, next) => {
    salesmodel
        .find({barcode: req.params.barcode})
        .sort({ 'date': 1 })
        .exec()
        .then(result=>{
            if (result.length>0){
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
                res.status(404).json({message:"No sales data for this product or product not found"});
            }
        })
        .catch(error=>{
            res.status(500).json({message: error.message});
        });
});

router.post("/",(req,res,next)=>{
    const newsale=salesmodel(req.body);
    newsale.save()
        .then(result => {
            res.status(200).json({result})
        })
        .catch(error => {
            res.status(400).json({ message: error.message });
        })
});

module.exports = router;