var passport=require("passport");
var mongoose=require("mongoose");

module.exports=function(){
  var User=mongoose.model('User');

  // 간단하게 얘기해서, 세션을 관리하는 곳이다.
    // user Serialize Handle..
    // When a user is authenticated, Passport will save its _id property in the session.
    // Later on when the user object is needed, passport will use the _id property to grab the user object from databse.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-password -salt', function(err, user) {
            done(err, user);
        });
    });

    require('./strategy/facebook.js')();
    require('./strategy/google.js')();
};
