var mongoose =require('mongoose'),
    //connection=require('../../config/mongoose'),
    Schema=mongoose.Schema;
    // mongoose.Primise=global.Promise;
    // mongoose.connect(config.host);
var crypto = require("crypto");

/*
User Model 정의서
firstName - String
lastName - String
email - String, 이메일 정규식에 맞춰야함
username - String, trim처리, required 메시지, unique해야함.
password - String, 6글자 이상이여야함.
salt - random data that is used as an additional input to a one-way function that "hashes" a password or passphrase.
provider - User가 등록된 Strategy 경로
providerId - 제공한 provider의 고유키
providerData - provider에서 제공하는 정보를 죄다 저장함.
created - Date, 기본 - 현재시간
website - String > Getter, Setter에 Http:// 가 없으면 붙여준다.
*/
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        match: [/.@.+\..+/, "Please fill a valid e-mail address"]
    },
    username: {
        type: String,
        trim: true,
        required: 'Username is required',
        unique: true
    },
    password: {
        type: String,
        validate: [
            function(password) {
                return password & password.length >= 5;
            }, 'Password should be longer'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {
    },
    created: {
        type: Date,
        default: Date.now
    }
});
// 가상의 속성. fullName을 가져올 경우 this.firstname + this.lastname
// set을 할 경우 나눔
UserSchema.virtual('fullName').get(function() {
    return this.firstName + '' + this.lastName;
}).set(function(fullName) {
    if (fullName) {
        var splitName = fullName.split('');
        this.firstName = splitName[0] || '';
        this.lastName = splitName[1] || '';
    }
});
// save 하기전에 작업하는 것
// password가 존재할 경우
// randomybytes(16)를 생성하여 hash salt를 만든다.
// 그리고 hashpassword로 생성한다.
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});
// hashpassword - Salt로 비밀번호를 암호화 시킨다.
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};
// 사용자가 입력한 암호를 해쉬 처리 한 것이랑 디비의 해쉬처리된 암호랑 같은지 확인
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};
// UniqueUsername을 찾는 메소드
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    // username String 처리
    var possibleUsername = username + (suffix || '');
    // possibleUserName으로 findOne을 찾는다.
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        //에러가 없으면
        if (!err) {
            // user가 없으면 해당 이름을 리턴한다.
            if (!user) {
                callback(possibleUsername);
            }
            // 있으면 다시 findUniqueUserName을 탄다.
            else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
            //에러가 나면 null 리턴
        }
        else {
            callback(null);
        }
    });
};
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
mongoose.model('User', UserSchema);
