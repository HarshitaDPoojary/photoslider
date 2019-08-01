const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
var multer = require('multer');
var formidable=require('express-formidable');
const port=8000;


const userProfileRoutes= require('./routes/profile.js');
const postRoutes= require('./routes/post.js');
const authenticationRoutes= require('./routes/authenticate.js');


mongoose.Promise = global.Promise;

//connection
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,useCreateIndex: true
}).then(() => {
    console.log("connected");    
}).catch(err => {
    console.log(err);
    process.exit();
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(multer({ dest: './uploads',
//     rename: function (fieldname, filename) {
//       return filename;
//     },
//    }));

app.use('/user', userProfileRoutes);
app.use('/post', postRoutes);
app.use('/', authenticationRoutes);


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});