// 회원가입 유효성 검사

const User = require("../models/User");         // User 모델
const {body} = require("express-validator");    // 유효성 검사 기능
const createError = require("http-errors");     // 에러 처리 기능


// 미들웨어 선언 및 exports
module.exports = async (req, res, next) => {
    try {

        // 이메일 검사
        const emailResult = await body("email")                             // 사용자가 입력한 값
            .isEmail()                                                      // 유효한 이메일인지 검사
            
            .custom(async (email) => {
                // 이메일로 유저 검색
                const user = await User.findOne({email});
                
                // 가입된 이메일인 경우
                if(user) {
                    throw new Error("E-mail is already in use");
                }
            })
            .run(req);

        // 이메일 유효성 검사 실패
        if(!emailResult.isEmpty()) {
            throw new createError.BadRequest("E-mail validation failed");
        }

        // 아이디 검사
        const usernameResult = await body("id")
            .trim()
            .isLength({min : 5})                                            // 길이 검사(최소 5글자)
            .isAlphanumeric()                                               // 알파벳 또는 숫자인지 검사
            // 유저가 입력한 username으로 유저 검사
            .custom(async (username) => {
                const user = await User.findOne({username});

                // 이미 가입된 username인 경우
                if(user) {
                    throw new Error("Username is already in use");
                }
            })
            .run(req);

        // 아이디 유효성 검사 실패 처리
        if(!usernameResult.isEmpty()) {
            throw new createError.BadRequest("Username validation falied");     // 400 BadRequest
        }

        // 비밀번호 검사
        const passwordError = await body("password")
            .trim()
            .isLength({min : 5})
            .run(req);

            // 비밀번호 유효성 검사 실패 처리
            if(!passwordError.isEmpty()) {
                throw new createError.BadRequest("Passowrd validation failed"); // 400 BadRequest
            }

            // 유효성 검사 통과 시 다음 미들웨어 호출
            next();

            // 에러 핸들러에게 에러 전달
    } catch (error) {
        next(error);
    }
};