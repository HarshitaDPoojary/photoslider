const express = require('express');
var formidable=require('express-formidable');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const imageFilter=require('../filter');
const path= require('path');
const fs=require('fs-extra');

var multer = require('multer');
var storage =multer.diskStorage({
        destination:'./uploads/posts',
        filename: function ( req, file, cb ) {
         
            cb( null, req.token.slice(-10)+'.jpg');
        }
    }
);

var upload = multer( { 
    fileFilter:  function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'));
    }
        cb(null, true);
    },
  storage: storage } );



const postController = require('../controllers/post.controller');

const router=express.Router();



router.post('/create',verifyToken,upload.single('file'),postController.create);
router.get('/getMyPosts',verifyToken,postController.getMyPost);
router.get('/getAllPost/:emailid',verifyToken,postController.getAllPost);

// router.delete('/delete/:postId',postController.delete);
// router.post('/like',upload.any(),postController.like);





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