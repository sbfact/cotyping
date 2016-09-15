var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function( email, password, done){
    User.findOne({
        where: {
            email: email
        }
    }).then(function( user ){
        if(!user){
            return done(null, false);
        }
        if(user.password !== password){
            return done(null, false);
        }
        return done(null, user);
    }).catch(function( err ){
        done(err, null);
    });
}));

passport.use(new FacebookStrategy({
    clientID: '1811399525805272',
    clientSecret: 'd2443cb5799b2e490b9cebe2d948bb5d',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['email', 'id', 'name', 'picture']
}, function( accessToken, refreshToken, fbProfile, done ){

  console.log(fbProfile);
  done(null,fbProfile);
}));

// serialize
// 인증후 사용자 정보를 세션에 저장
passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});


// deserialize
// 인증후, 사용자 정보를 세션에서 읽어서 request.user에 저장
passport.deserializeUser(function(user, done) {
    //findById(id, function (err, user) {
    console.log('deserialize');
    done(null, user);
    //});
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
app.use('/users', users);

app.get('/auth/facebook',passport.authenticate('facebook'));
app.get('/auth/facebook/callback',passport.authenticate('facebook',{successRedirect:'/login_success',failureRedirect:'/login_fail'}));

app.get('/login_success',ensureAuthenticated,function(req,res){
  console.log("로그인에 성공");
  res.send(req.user);
});

app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){return next();}
  res.redirect('/');
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
