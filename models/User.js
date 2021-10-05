const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config()

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5
    },
    role: {
        type: Number,
        default: 0, // 일반 유저 0, admin : 1
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

userSchema.pre("save", function (next) {
    var user = this;
    //비밀번호를 save 하기전에 암호화함
    if (user.isModified("password")) {
        // 패스워드가 변환 될때.. (가입이나 수정시)
        console.log("hash");
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        // 패스워드 변경 외 다른것들이 변화한다면.....
        next();
    }
});

//painPassword === db에 암호화된 비밀번호 비교 메서드 작성
userSchema.methods.comparePassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// 비밀번호까지 맞다면 jwt 생성하는 메소드 작성
userSchema.methods.generateToken = function (callback) {
    var user = this;

    var token = jwt.sign(user._id.toHexString(), process.env.COOKIE_SECRET);

    // console.log(callback())

    user.token = token;
    user.save(function (err, user) {
        if (err) return callback(err);

        callback(null, user);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
