var express=require('express');
var router = express.Router();

var users=require('./user_model');

var FacebookStrategy  = require('passport-facebook').Strategy;


var jwt = require('jsonwebtoken');
var jwtSecret = 'secret';

//로그인


module.exports = function(app) {
  app.post('/login/local',function(req,res,next){
    var localEmail=req.body.email;
    var localPassword=req.body.password;

    var findConditionLocalUser={
      email:localEmail,
      localPassword:localPassword
    };//디비에서 유저정보를 찾기위한 조건(회원검색)

    users.findOne(findConditionLocalUser).exec(function(err,user){
      if(err){
        res.json({type:false, data:"Error occured "+err});
      }else if(!user){
        res.json({type:false, data:"Incorrect email/password"});
      }else if(user){
        res.json({type:true, data: user, token: user.jsonWebToken});
      }
    });
  });


  app.post('/login/local/signup', function(req,res,next){
    var localEmail=req.body.email;
    var localPassword=req.body.password;

    console.log(localEmail);
    console.log(localPassword);

    var findConditionLocalUser={
      email:localEmail
    };

    users.findOne(findConditionLocalUser).exec(function(err,user){
      if(err){
        res.json({
          type:false,
          data:"Error occured "+err
        });
        console.log(user);
      }else if(user){
        res.json({
          type:false,
          data:"Email already exists"
        });
      }else if(!user){
        localSignup(localEmail,localPassword, function(err,savedUser){
          if(err){
            res.json({
              type:false,
              data:"Error occured "+err
            });
          }else{
            res.json({
              type:true,
              data:savedUser,
              token:savedUser.jsonWebToken
            });
          }
        });
      }
    });
  });

  function localSignup(userId, userPassword, next){
    var userModel=new users();
    userModel.email=userId;
    userModel.localPassword=userPassword;
    console.log(userModel);
    userModel.save(function(err, newUser){
      newUser.jsonWebToken=jwt.sign(newUser, jwtSecret);
      newUser.save(function(err,savedUser){
        next(err,savedUser);
      });
    });
  }
  //토큰값을 가지고있을때 다시 로그인할필요가 없음을 의미한다.
  app.get('/me', ensureAuthorized, function(req,res,next){
    var findCoditionToken={
      jsonWebToken:req.token
    };

    console.log(req.token);
    users.findOne(findConditionToken,function(err,user){
        if(err){
          res.json({
            type:false,
            data: "Error occured: "+ err
          });
        }else{
          console.log("me : "+ user);
          res.json({
            type:true,
            data:user
          });
        }
    });
  });

  function ensureAuthorized(req, res, next) {
      var bearerToken;
      var bearerHeader = req.headers["authorization"];
      console.log(bearerHeader);
      if (typeof bearerHeader !== "undefined") {
          var bearer = bearerHeader.split(" ");
          bearerToken = bearer[1];
          req.token = bearerToken;
          next();
      } else {
          res.send(403);
      }
  }

  app.get('/oauth/facebook', passport.authenticate('facebook', {
      failureRedirect: '/signin'
  }));

  app.get('/oauth/facebook/callback', passport.authenticate('facebook',  {
      scope: [ 'email' ],
      failureRedirect: '/signin',
      successRedirect : '/'
  }));

  // google
  app.get('/oauth/google', passport.authenticate('google', {
      failureRedirect: '/signin',
      scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
          ],
  }));

  app.get('/oauth/google/callback', passport.authenticate('google', {
      failureFlash: '/signin',
      successRedirect: '/'
  }));

};
