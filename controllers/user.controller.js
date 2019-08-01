const User = require('../models/user.model.js');
const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds = 10;

const path= require('path');
const jwt = require('jsonwebtoken');
const Joi=require('joi');
const schema= require('../models/joi.model');



exports.create = async(req, res) => {
    
    if(!req.body.emailid) {
        return res.status(400).send({
            message: "Email id can not be empty"
        });
    }
    if(!req.body.password) {
        return res.status(400).send({
            message: "Password can not be empty"
        });
    }
    
    Joi.validate({firstname:req.body.firstname,lastname: req.body.lastname,email:req.body.emailid,password:req.body.password},schema, async (err,value)=>{
        if(err)
        {
            console.log("\n"+err);
            res.send(err.details[0].message);
        }
        else{
            // console.log("\n\nFilename:        "+req.file.file)
            let user = await User.findOne({ emailid: req.body.emailid });
            if (user) {
                return res.status(400).send('user already exisits!!');
            } else {
            var password=req.body.password;
            var salt = bcrypt.genSaltSync(saltRounds);
            var hash = bcrypt.hashSync(password, salt);
            console.log("\n"+hash);
            
            const user = new User({
                firstname:req.body.firstname, 
                lastname:req.body.lastname,
                password: hash,
                emailid: req.body.emailid,        
            });

            try{
                var newImg=fs.readFileSync(path.join(path.dirname(process.mainModule.filename),'uploads',req.body.emailid+'.jpg'))
            
                if(newImg){
                    var encImg=newImg.toString('base64');
                    user.contentType="image/png";
                    user.img= Buffer(encImg, 'base64');
                    fs.unlink(path.join(path.dirname(process.mainModule.filename),'uploads',req.body.emailid+'.jpg')  , (err) => {
                        if (err) throw err;
                        console.log('successfully deleted profile img from directory');
                      });
                }
            }
            catch(err)
            {

                 console.log(err);
            }
            
            user.save()
            .then(data => {
                console.log(data);
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the profile."
                });
                process.exit();
            });
            }
        
    

        }
        
    });
};


exports.login=async(req,res)=>
{

    let user = await User.findOne({emailid: req.body.emailid},{firstname:1,lastname:1,emailid:1,password:1});
    let user1={
        firstname:user.firstname,
        lastname:user.lastname,
        emailid:user.emailid
    }
    bcrypt.compare(req.body.password, user.password,(err, result) =>{
        if (result == true) {
            jwt.sign({user1},"HelloAlbumProject170619",  { expiresIn: '3000s' } ,(e, token) => {
                if(e)
                {
                    res.status(403).send('Bad request');
                }
                res.json({token:token});
               
                
            });
        } else {
         console.log('Incorrect password');
         res.send('Invalid credentials');
         
        }
    });
    
       
    //  process.exit();
}




