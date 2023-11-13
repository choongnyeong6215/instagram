// 인증 처리

const JwtStrategy = require("passport-jwt").Strategy;   // 토큰 처리 방법
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");                 // User 모델
const passport = require("passport");                   // 인증처리 기능 제공
require("dotenv").config();                             // 환경변수 사용환경 제공


// JWT 처리전략 옵션
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();     // 토큰 추출방법 옵션 - 인증 헤더(Authorization Header)에서 토큰 추출
optes.secretOrkey = process.env.SECRET;                             // 토큰 해독에 사용되는 키 (비밀번호 암호화에 사용된 키)


// JWT 처리전략 생성
const JwtStrategy = new JwtStrategy(opts, async (payload, done) => {
    try {

        // payload에 저장된 정보로 유저를 검색
        const user = await User.findById(payload.sub);          // Model.findId(id) : id로 한개의 도큐먼트 검색

        // 유저가 존재하지 않을 경우 인증 실패
        if(!user) {
            return done(null, false);
        }

        // 존재할 경우 인증 성공
        return done(null, user);

    } catch (err) {
        return done(err, false);
    }
})


// 토큰 처리전략 적용
passport.use(JwtStrategy);


// 처리전략 exports (jwt를 사용함으로 session 사용x로 설정)
module.exports = passport.authenticate("jwt", {session : false});