// 로그인 데이터 유효성 검사

const User = require("../models/User");         // User 모델과 데이터 통신
const {body} = require("express-validator");    // 유효성 검사 기능 제공
const createError = require("http-errors");     // 에러 처리 기능
// const { create } = require("../models/Comment");


// 미들웨어 선언 및 exports
/*
    1. req (request) : 요청 객체
    2. res (response) : 응답 객체
    3. next : 다음 미들웨어 호출 함수
*/
module.exports = async (req, res, next) => {
    try {
        
        // 이메일 검사
        const emailResult = await body("email")                                         // 유저가 입력한 값
            .isEmail()                                                                  // 올바른 이메일인지 검사
            .custom(async (email) => {                                                  // 커스텀 기능
                // 유저가 입력한 이메일로 유저 검색
                // Model.findOne(fields) : 필드로 한개의 도큐먼트 검색
                const user = await User.findOne({email});

                // 유저가 존재하지 않는 경우 -> 401(권한없음) 에러 처리
                if(!user) {                                                             
                    throw new createError.Unauthorized("E-mail does not exists");
                }
            })
            .run(req);

        // 이메일 유효성 검사 실패한 경우
        if(!emailResult.isEmpty()) {                                                    
            throw new createError.Unauthorized("E-mail validation failed");
        }

        // 비밀번호 검사
        const passwordResult = await body("password")
            .trim()
            .notEmpty()                                                                 // 값이 없는지 검사
            .custom(async (password, {req}) => {                                        // 커스텀 (개발자가 지정한 검사)
                // 유저가 입력한 이메일
                // 이메일로 유저 검색
                const email = req.body.email;
                const user = await User.findOne({email});

                // 비밀번호 틀린 경우 -> 401 에러 처리
                if(!user.checkPassword(password)) {
                    throw new createError.Unauthorized("password does not match");
                }
            })
            .run(req);

        //  비밀번호 유효성 검사 실패한 경우
        if(!passwordResult.isEmpty()) {
            throw new createError.Unauthorized("password validation failed");
        }

        // 인증 성공 시 다음 미들웨어 호출
        next();

        // 에러 핸들러에게 에러 전달
    } catch (error) {
        next(error);
    }
};