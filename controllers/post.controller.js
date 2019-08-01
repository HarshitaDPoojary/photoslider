const User = require('../models/user.model.js');
const Post = require('../models/post.model.js');
const express = require('express');
const fs = require('fs');

const path= require('path');
const jwt = require('jsonwebtoken');



exports.create = async(req, res) => {
    jwt.verify(req.token, 'HelloAlbumProject170619' , async(err, data)=>{
        if(err) {
            res.status(403).send("the token is invalid or expired"); 
        }
        else{
            console.log("in post create");
            console.log(data.user1.emailid);
            let user = await User.findOne({ emailid: data.user1.emailid});
            if (user) {
                const post = new Post({
                    title:req.body.title || "Untitled Post",
                    ownerid: user._id,
                    caption:req.body.caption,
                    // img: Buffer(encImg, 'base64')
                });
                try{
                    var newImg=fs.readFileSync(path.join(path.dirname(process.mainModule.filename),'uploads','posts',req.token.slice(-10)+'.jpg'))
                    if(newImg){
                        var encImg=newImg.toString('base64');
                        post.contentType="image/png";
                        post.img= Buffer(encImg, 'base64');
                        fs.unlink(path.join(path.dirname(process.mainModule.filename),'uploads','posts',req.token.slice(-10)+'.jpg')  , (err) => {
                            if (err) throw err;
                            console.log('successfully deleted profile img from directory');
                          });
                    }
                }
                catch(err)
                {
                    console.log(err);
                }
                 
                post.save()
                    .then(data1 => {
                        console.log("\n\n"+data1.postId+"\n\n");
                        postId={ postid: data1.postId}
                        User.findOneAndUpdate({emailid:data.user1.emailid}, {$push: {posts: {postid: data1.postId}}}).then( user=>{
                            console.log('\n user post id array updated');
                            res.json({message:"Post created", postid : data1.postId});
                        }
                            
                        )
                        .catch(err=>
                            {
                                console.log(err);
                            })
                        // res.send(data1);
                    }).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Post."
                        });
                        process.exit();
                    });
            }

        }
 });  
};