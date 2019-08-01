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

router.get('/update',verifyToken , (req,res)=>{
    console.log("in user");
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired"); 
        }
        else{
            User.findOne({emailid: data.user1.emailid}).then(user => {
               res.render('update',{
                    user: user,
                    pageTitle: 'Edit your profile'
                  });
                console.log(user.emailid);
            })
           .catch(err=>{
               res.send(err);
           });
        }
    });
    
});

router.get('/updatePassword',verifyToken,upload.single('file'),async(req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{
            User.findOne({emailid: data.user1.emailid}).then(user => {
                res.render('update-password',{
                     user: user,
                     pageTitle: 'change password'
                   });
                 console.log(user.emailid);
             })
            .catch(err=>{
                res.send(err);
            });
         }
     });
     
 });

 router.get('/updateImg',verifyToken,upload.single('file'),async(req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{
            User.findOne({emailid: data.user1.emailid}).then(user => {
                res.render('update-profileimage',{
                     user: user,
                     pageTitle: 'Change Dp'
                   });
                 console.log(user.emailid);
             })
            .catch(err=>{
                res.send(err);
            });
         }
     });
     
 });

router.get('/removeImg',verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{

            User.updateOne({ emailid: data.user1.emailid }, { $unset: { contentType: 1, img:1 } })
            .then(user => {
                res.json({messsage: "Profile pic removed"});
            })
            .catch(err=>{
                res.send(err);
            })  
        }
    });
});

router.post('/update',verifyToken ,upload.none(), (req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{
            Joi.validate({firstname:req.body.firstname,lastname: req.body.lastname},schema, async (err,value)=>{
            if(err)
            {
                console.log("\n"+err);
                res.send(err.details[0].message);
            }
            else{

            
                    console.log(req.body);
                    User.updateOne({ emailid: data.user1.emailid }, { $set: { firstname: req.body.firstname, lastname:req.body.lastname } }).then(user => {
                        let emailid=data.user1.emailid;
                        jwtBlacklist.blacklist(req.token);
                

                    user1={
                        firstname:req.body.firstname,
                        lastname:req.body.lastname,
                        emailid:emailid
                    }
            
                    jwt.sign({user1},"HelloAlbumProject170619",  { expiresIn: '3000s' } ,(e, token) => {
                    if(e)
                    {
                        res.status(403).send('Bad request');
                    }
                    res.json({"message":"profileUpdated","newtoken":token});
                    console.log(token);
            
                    
                });
                
            })
           .catch(err=>{
               res.send(err);
           });
        }});
        }
    });
});

router.post('/updateImg',verifyToken,upload.single('file'),async(req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{

            if(req.body.emailid== data.user1.emailid){
                try{
                    var newImg=fs.readFileSync(path.join(path.dirname(process.mainModule.filename),'uploads',data.user1.emailid+'.jpg'));
                
                    if(newImg){
                        var encImg=newImg.toString('base64');
                        contentType="image/png";
                        img= Buffer(encImg, 'base64');
                        User.updateOne({ emailid: data.user1.emailid }, { $set: { contentType: contentType, img:img } })
                        .then(user => {
                            res.json({messsage: "Profile pic updated"});
                        })
                        .catch(err=>{
                            res.send(err);
                        })
    
                        fs.unlink(path.join(path.dirname(process.mainModule.filename),'uploads',req.body.emailid+'.jpg')  , (err) => {
                            if (err) throw err;
                            console.log('successfully deleted profile img from directory');
                          });
    
                        
                    }
                    
                    
    
    
                }
                catch(err)
                {
                    console.log(err);
    
                    res.json({messsage: "no file uploaded"});
                    
                }
                
            }
            else{
                res.json({message:"Invalid email id"});
                fs.unlink(path.join(path.dirname(process.mainModule.filename),'uploads',req.body.emailid+'.jpg')  , (err) => {
                    if (err) throw err;
                    console.log('successfully deleted profile img from directory');
                  });
            }
            
            
        }
    });

})

router.post('/updatePassword',verifyToken ,upload.none(), async (req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired");  
        }
        else{
            console.log(req.body.password);
            console.log(data.user1.emailid);
            User.findOne({emailid: data.user1.emailid}).then(user=>
            {
                // console.log(user.emailid);

                bcrypt.compare(req.body.password, user.password,(err, result) =>{
                    if (result == true) {
                        var password=req.body.newpassword;
                        var salt = bcrypt.genSaltSync(saltRounds);
                        var hash = bcrypt.hashSync(password, salt);
                        User.updateOne({ emailid: data.user1.emailid }, { $set: { password: hash} }).then(user => {
                            let emailid=data.user1.emailid;
                           
                            
            
                         user1={
                            firstname:data.user1.firstname,
                            lastname:data.user1.lastname,
                            emailid:emailid
                            }
                            jwtBlacklist.blacklist(req.token);
                        
                            jwt.sign({user1},"HelloAlbumProject170619",  { expiresIn: '3000s' } ,(e, token) => {
                                if(e)
                                {
                                    res.status(403).send('Bad request');
                                }
                                res.json({"message":"new password set","newtoken":token});
                                console.log(token);
                        
                                
                            });
                            
                        })
                       .catch(err=>{
                           res.send(err);
                       });
                       


                    } else {
                     console.log("Old password doesn/'t match");
                     res.send("Old Password doesn/'t match");
                     
                    }
                });
            }    

            )
            .catch(err=>{
                res.send(err);
            }
               )

        }
    });
});

router.get('/logout',verifyToken ,upload.none(), (req,res)=>{
    jwt.verify(req.token, 'HelloAlbumProject170619' ,(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired"); 
        }
        else{
            console.log(req.body);
            User.updateOne({ emailid: data.user1.emailid }, { $set: { firstname: req.body.firstname, lastname:req.body.lastname } })
            .then(user => {
                
                jwtBlacklist.blacklist(req.token);
                res.json({"message":"Logout successful"});
            
                
            })
           .catch(err=>{
               res.send(err);
           });
        }
    });
});

function verifyToken(req, res, next) {
    // console.log(req.headers['auth']);
    const header = req.headers['auth'];
    // console.log(header);
    if(typeof header !== 'undefined') {
      req.token = header;
      next();
    } else {
        res.status(403).send('Bad Requeset');
    }
  }

  module.exports = router;