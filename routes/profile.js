const User = require('../models/user.model.js');
const express = require('express');
var formidable=require('express-formidable');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path= require('path');
const Joi=require('joi');
const schema= require('../models/joiupdate.model');

const jwtBlacklist = require('jwt-blacklist')(jwt);

var multer = require('multer');
var storage = multer.diskStorage(
    {
        destination: './uploads/',
        filename: function ( req, file, cb ) {
            cb( null, req.body.emailid+'.jpg');
        }
    }
);

var upload = multer( {fileFilter:  function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
    }
        cb(null, true);
    }, storage: storage } );


const router=express.Router();



router.get('/',verifyToken , (req,res)=>{
    console.log("in user");
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("Token is invalid or expired"); 
        }
        else{
            
            User.findOne({emailid:data.user1.emailid}).then(user => {
                
                // res.send(" Email id:"+data.user1.emailid+"\n Firstname:"+user.firstname+"\n");
              
                    res.render('view-profile',{user:user , Title: "My Profile"});
               
                    
                
                
                console.log(user.emailid);
            })
           .catch(err=>{
               res.send(err);
           });
        }
    });
    // process.exit();
});


