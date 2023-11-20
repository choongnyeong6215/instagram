const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// User 모델
const User = require("../models/User");
// 인증처리 기능 제공
const passport = require("passport");
// 환경변수 사용환경 제공
require("dotenv").config();


// JWT 처리전략 옵션
const opts = {};
// 토큰 추출방법 옵션 - 인증 헤더(Authorization Header)에서 토큰 추출
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// 토큰 해독에 사용되는 키
opts.secretOrKey = process.env.SECRET;


// JWT 처리전략 생성
const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    // payload에 저장된 정보로 유저를 검색한다
    const user = await User.findById(payload.sub);
    // Model.findById(id): id로 한개의 도큐먼트를 검색한다

    // 인증 실패
    if (!user) {
      return done(null, false);
    }
    
    // 인증 성공
    return done(null, user);

  } catch (err) {
    return done(err, false);
  }
})

// 토큰 처리전략 적용
passport.use(jwtStrategy);

// 처리전략 exports
module.exports = passport.authenticate("jwt", { session: false });