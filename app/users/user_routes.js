var express=require('express');
var router = express.Router();

var users=require('./user_model');

var passport          = require('passport');
var FacebookStrategy  = require('passport-facebook').Strategy;


var jwt = require('jsonwebtoken');
var jwtSecret = 'secret';

//로그인
router.post('/login/local',function(req,res,next){
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


router.post('/login/local/signup', function(req,res,next){
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
router.get('/me', ensureAuthorized, function(req,res,next){
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


/***********************************
 *           FB Login              *
 ***********************************/

router.post('/login/fb',function(req,res,next){
  var fbUserEmail=req.body.fbUserEmail;
  var fbAccessToken=req.body.fbAccessToken;

  var findConditionfbUserEmail={
    email:fbUserEmail//email이 존재하는지 확인하기
  };

  users.findOne(findConditionfbUserEmail).exec(function(err,user){
    if(err){
      res.json({
        type:false,
        data:"Error occured "+err
      });
    }else if(!user){
      console.log('user not found');
      fbSignup(fbUserEamil, fbAccessToken, function(err,savedUser){
        console.log(1);
        if(err){
          res.json({
            type:false,
            data:"Error occured "+err
          });
        }else{
          res.json({
            type:true,
            data:saveduser,
            token:savedUser.jsonWebToken
          });
        }
      });
    }else if(user){

      console.log('user');
      console.log(user);
      user.fbToken=fbAccessToken;
      user.save(function(err,savedUser){
        res.json({
          type:true,
          data:user,
          token:user.jsonWebToken
        });
      });
    }
  });
});

function fbSignup(fbUserEmail, fbAccessToken, next) {
    var userModel = new users();
    userModel.email = fbUserEmail;
    userModel.fbToken = fbAccessToken;
    userModel.save(function (err, newUser) {
        newUser.jsonWebToken = jwt.sign(newUser, jwtSecret);
        newUser.save(function (err, savedUser) {
            next(err, savedUser);
        });
    });
}

module.exports=router;
