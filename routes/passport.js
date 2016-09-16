var express=require('passport');
var router=express.Router();

var users=require('../model/user');
var jwt=require('jsonwebtoken');
var jwtSecret='secret';
