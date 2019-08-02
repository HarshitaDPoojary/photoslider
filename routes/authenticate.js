const express = require('express');
var formidable=require('express-formidable');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


var multer = require('multer');
var storage = multer.diskStorage(
    {
        destination: './uploads',
        filename: function ( req, file, cb ) {
            cb( null, req.body.emailid+'.jpg');
        }
    }
);

var upload = multer( { 
    fileFilter:  function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb('Only jpeg/jpg/png images allowed', null);
        }
        cb(null, true);
      },
  storage: storage } );

const userController = require('../controllers/user.controller');

const router=express.Router();

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

router.post('/register',upload.single('file'),userController.create);
router.post('/login',upload.none(),userController.login);
router.post('/',(res,req)=>{
    res.send("welcome");
});



module.exports = router;