var express = require("express");
var router = express.Router();
var usermodel = require("../model/usermodel");
var bcrypt = require("bcrypt");

router.get("/:username", (req, res, next) => {
  usermodel
      .findOne({username: req.params.username})
      .select("-password")
      .exec()
      .then(result=>{
        if (result){
          res.status(200).json(result);
        }
        else{
          res.status(404).json({message:"User not found"});
        }
      })
      .catch(error=>{
        res.status(500).json({message: error.message});
      });
});

router.get("/",(req,res,next)=>{
  usermodel
      .find()
      .select("-password")
      .exec()
      .then(result=>{
        res.status(200).json(result);
      });
});

//Handle signup requests
router.post("/signup", (req, res, next) => {
  var newuser = usermodel(req.body);
  newuser.save()
      .then(result => {
        res.status(200).json({
          id: result._id,
          username: result.username,
          email:result.email,

        })
      })
      .catch(error => {
        if (error.code === 11000) {
          res.status(409).json({ message: "Username already exists" });
        }
        else {
          res.status(400).json({ message: error.message });
        }
      })
});

//Handel login requests
router.post("/login", (req, res, next) => {
  usermodel
      .findOne({ username: req.body.username })
      // .populate("vehicles")
      .exec(function (err, result) {
        if (err || !result) {
          res.status(400).json({ message: "Invalid credentials" });
        }
        else {
          bcrypt.compare(req.body.password, result.password, function (err, valid) {
            if (valid) {
              console.log(result);
              return res.status(200).send({
                id: result._id,
                username: result.username,
                type: result.type,
              });
            }
            else {
              return res.status(400).json({ message: "Invalid credentials" });
            }
          })
        }
      })
});

router.patch("/:username", (req, res, next) => {
  usermodel
      .findOneAndUpdate({username:req.params.username}, req.body, { new: true })
      .select("-password")
      .exec()
      .then(result => {
        if (result) {
          delete result.password;
          return res.status(200).json(result);
        }
        else {
          return res.status(404).json({ message: "User not found" });
        }
      })
      .catch(error => {
        return res.status(500).json({ message: error.message });
      })
});

module.exports = router;
