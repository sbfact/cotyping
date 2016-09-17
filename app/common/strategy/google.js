var passport = require("passport");
var url = require("url");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var config = require("../../../config/env/development");
var users=require("../../users/user_controller");

module.exports = function() {
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
        passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        var providerUserProfile = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            username: profile.username,
            provider: 'google',
            providerId: profile.id,
            providerData: providerData
        };

        users.saveOAuthUserProfile(req, providerUserProfile, done);
    }));
};
