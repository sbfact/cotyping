var passport=require("passport");
var FacebookStrategy  = require('passport-facebook').Strategy;
var config=require("../../../config/env/development");
var users=require("../../users/user_controller");

module.exports=function(){
  passport.use(new FacebookStrategy({
    clientID:config.facebook.clientID,
    clientSecret:config.facebook.clientSecret,
    callbackURL:config.facebook.callbackURL,
    profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    passReqToCallback:true

  }, function(req, accessToken, refreshToken, profile, done){
    var providerData=profile._json;
    providerData.accessToken=accessToken;
    providerData.refreshToken=refreshToken;

    var providerUserProfile={
      firstName: profile.name.givenName,
      lastName:profile.name.lastName,
      fullName:profile.displayName,
      email:profile.email,
      username:profile.id,
      provider:'facebook',
      providerId:prifile.id,
      providerData:providerData
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);

  }));
};
