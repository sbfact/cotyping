var User = require("mongoose").model('User');
var passport = require("passport");

// Passport module
// 로그인화면으로. 유저가 없으면 회원가입화면으로 있으면 홈화면으로
exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/');
    }
};
// Passport module
//회원 가입 화면으로. 유저가 없으면 회원가입으로 있으면 홈화면으로
exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/');
    }
};

// 가입
exports.signup = function(req, res, next) {
    //유저가 없을 경우
    if (!req.user) {
        // req.body에서 user추출
        var user = new User(req.body);
        var message = null;
        // 로컬에서 생성
        user.provider = 'local';
        // 저장
        user.save(function(err) {
            if (err) {
                message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            // 저장후 로그인 한다.
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                //로그인 후 메인 화면으로 간다.
                return res.redirect('/');
            });
        });
    }
    else {
        return res.redirect('/');
    }
};
// 로그아웃
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

// Create
exports.create = function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};

//list
exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.json(users);
        }
    });
};

exports.read = function(req, res) {
    res.json(req.user);
};
exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: id
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            req.user = user;
            next();
        }
    });
};
// update
exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};
// delete
exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    });
};
// user profile에 인증을 저장.
exports.saveOAuthUserProfile = function(req, profile, done) {
    // provider, id로 검색
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        else {
            // 검색했는데 사용자가 없으면
            if (!user) {
                // username에 사용자 이메일 앞부분을 더해서 리턴한다.
                var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
                // 그리고 이 사용가능한이름을 usermodel의 findUniqueUsername에 넣어서 새로운 유저로 저장한다.
                User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                    profile.username = availableUsername;
                    user = new User(profile);
                    user.save(function(err) {
                        return done(err, user);
                    });
                });
            }
            else {
                //사용자 리턴한다.
                return done(err, user);
            }
        }
    });
};
