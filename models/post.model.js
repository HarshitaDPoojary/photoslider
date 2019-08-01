const mongoose = require('mongoose');
// const User = require('../models/user.model.js');

const autoIncrement = require('mongoose-sequence')(mongoose);


var PostSchema = new mongoose.Schema({
    postId:{type: Number,
    unique:true },
    title: String,
    ownerid: {
        type: mongoose.Schema.Types.Number,
        ref: 'User'
    },
    caption : String,
    contentType: String,
    img:  Buffer
    
  },
  {
    timestamps: true,
    
    }
);


var PostSchema=PostSchema.plugin(autoIncrement, {inc_field: 'postId', startAt: 1000});

module.exports = mongoose.model('Post', PostSchema);