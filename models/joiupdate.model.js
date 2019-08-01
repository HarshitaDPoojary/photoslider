const Joi = require('joi');
module.exports =  Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).allow('').allow(null).optional() ,
    lastname: Joi.string().alphanum().min(3).max(30).allow('').allow(null).optional(),
    
});