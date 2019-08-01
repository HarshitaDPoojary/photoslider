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