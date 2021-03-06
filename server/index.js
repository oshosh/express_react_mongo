const express = require("express");
const app = express();
const port = 5000;
// const bodyParser = require('body-parser')
const config = require("./config/key");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
const { auth } = require("./middleware/auth")
// application/x-www-form-urlencoded
// name=kim&age=29 이런 형식들을 읽어 드린다.
app.use(express.urlencoded({ extended: true }));

// application/json
app.use(express.json());
app.use(cookieParser());

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("hello express1"));

app.get("/api/hello", (req, res) => res.send("client test call"));

app.post("/api/users/register", (req, res) => {
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면 그것을 db에 넣음
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true,
        });
    });
});

app.post("/api/users/login", (req, res) => {
    // 요청된 이메일을 db에서 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당한느 유저가 없습니다.",
            });
        }

        // 요청된 이메일 데이터가 db에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });

            // 비밀번호까지 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //application-> cookies에 x_auth로 토큰을 저장한다
                res
                    .cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, useId: user._id });
            });
        });
    });
});

app.get('/api/users/auth', auth, (req, res) => {
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
})

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" },
        (err, user) => {
            if (err) return res.json({ success: false, err })
            return res.status(200).send({ success: true })
        }
    )
})

app.listen(port, () => console.log(`current port ${port}`));
