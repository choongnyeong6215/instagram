const { use } = require("passport");
const User = require("../models/User");


/*
    User Controller

    1. create - 유저 생성
    2. login - 로그인
    3. update - 유저 정보 수정
*/


exports.create = async(req, res, next) => {
    try {

        // request body (클라이언트가 회원가입 시 전송한 데이터)
        const {email, name, username, password} = req.body;

        // 유저 데이터 생성
        // 모델 인스턴스 생성
        const user = new User();

        // 필드값 할당 (데이터 속성)
        user.email = email;
        user.name = name;
        user.username = username;
        user.setPassword(password);     // User 모델에 처리한 비밀번호 암호화

        // 저장
        await user.save();

        // 방금 생성한 유저의 정보 전달
        res.json({user});

    } catch (error) {
        next(error);
    }
};

exports.login = async(req, res, next) => {
    try {
        const {email} = req.body;                   // 클라이언트가 로그인 시에 입력한 이메일

        const _user = await User.findOne({email});  // 이메일로 유저 검색

        const access_token = _user.generateJWT();   // 로그인 토큰 생성


        // 클라이언트에게 전송할 유저 데이터
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token        // 인증 토큰
        }

        res.json({user});

    } catch (error) {
        next(error);
    }
};

exports.update = async(req, res, next) => {
    try {
        const _user = req.user;     // 로그인 유저

        if(req.file) {                              // 클라이언트가 전송한 파일로 프로필 사진 수정
            _user.avatar = req.file.filename;
        }

        if("name" in req.body) {                    // 전송한 이름으로 이름 수정
            _user.name = req.body.name;
        }

        if("bio" in req.body) {                     // 전송한 자기소개 내용으로 수정
            _user.bio = req.body.bio;
        }

        if("username" in req.body) {
            _user.username = req.body.username;
        }

        // 변경사항 저장
        await _user.save();

        const access_token = _user.generateJWT();

        // 유저 데이터 재생성 후 전송
        const user = {
            username : _user.username,
            name : _user.name,
            avatarUrl : _user.avatarUrl,
            bio : _user.bio,
            access_token
        }

        res.json({user});

    } catch (error) {
        next(error);
    }
};