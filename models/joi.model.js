const Joi = require('joi');

module.exports =  Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).allow('').allow(null).optional() ,
    lastname: Joi.string().alphanum().min(3).max(30).allow('').allow(null).optional(),
    password: Joi.string().min(3).regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required()
}).with('email','password');
