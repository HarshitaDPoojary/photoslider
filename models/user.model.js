const mongoose = require('mongoose');
require('mongoose-type-email');
const autoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = mongoose.Schema({
    _id: Number,
    firstname: String,
    lastname: String,
    password: String,
    emailid: mongoose.SchemaTypes.Email,
    contentType: String,
    img:  Buffer,
    posts:[{
        postid:{
                type: mongoose.Schema.Types.Number,
                ref: 'Post'
        }
    }],
    likes:[{
        postid:{
            type: mongoose.Schema.Types.Number,
            ref: 'Post'
    },
    }],
}, {
    
    _id:false
}
);

userSchema.plugin(autoIncrement);
module.exports = mongoose.model('User', userSchema);