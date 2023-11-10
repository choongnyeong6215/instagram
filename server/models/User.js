const mongoose = require("mongoose");       // 몽고DB용 ODM
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");        // 로그인 토큰 처리
const crypto = require("crypto");           // 암호화 기능
const post = require("./Post");             // Post model(화면)
const Following = require("./Following");   // Following model(화면)


/*
    스키마 (Schema)
    - 컬렉션의 구조

    - 컬렉션
    NoSQL에서 관련된 데이터를 분류하는 기준, RDB의 테이블에 해당
 */


// 유저 스키마 (유저 컬렉션의 구조) - create table 개념
// {} 내부 내용 : 제약조건
const userSchema = new Schema({
    email : {type : String, minLength : 5},                         // 이메일
    password : {type : String, minLength : 5},                      // 비밀번호
    salt : {type : String},                                         // 암호화에 사용되는 키
    username : {type : String, minLength : 3, required : true},     // 아이디
    name : {type : String},                                         // 이름
    avatar : {type : String, default : "default.png"},              // 프로필 사진
    bio : {type : String}                                           // 자기소개
}, {
    // 데이터 전송에 필요한 옵션
    toJSON : {virtuals : true},                                     // 가상 필드를 데이터에 포함
    toObject : {virtuals : true}
});


/*
    가상 필드 (Virtual Field)
    - 필요한 경우 스키마에 가상필드를 추가할 수 있다.
    - 가상필드는 db에 존재하지 않는다.
*/


// db join 개념
// 프로필 사진 URL
userSchema.virtual("avatarUrl").get(function() {
    // 데이터 가공(완성된 URL 제공)
    return process.env.FILE_URL + "/avatar/" + this.avatar;
})


// 게시물 갯수
userSchema.virtual("postCount", {
    ref : "Post",                   // Post 모델 참조
    localField : "_id",             // 기본키 - 컬렉션 조합의 기준
    foreignField : "user",          // 외래키 - 컬렉션 조합의 기준
    count : true
})


// 팔로워 수
userSchema.virtual('followerCount', {
    ref : "Following",              // Following 모델 참조
    localField : "_id",
    foreignField : "following",
    count : true
})


// 팔로잉 수
userSchema.virtual('followingCount', {
    ref : "Following",              // Following 컬렉션 참조
    localField : "_id",
    foreignField : "user", 
    count : true
})


// 로그인 유저가 해당 유저를 팔로우하는지 여부
userSchema.virtual("isFollowing", {
    ref : "Following",
    localField : "_id",
    foreignField : "following",
    justOne : true
})


/*
    오퍼레이션
    - 스키마의 데이터를 처리하는 기능
*/

// 비밀번호 암호화
userSchema.methods.setPassword = function (password) {      // 파라미터 (passord) : 유저가 입력한 비밀번호
    // 암호화에 사용되는 키
    this.salt = crypto
        .randomBytes(16).toString("hex");   // 16자리 16진수 문자열 타입 난수 변환

    // 암호화
    this.password = crypto
        // pbkdf2Sync(유저가 입력한 패스워드 원본, 암호화 키, 암호화 반복 횟수, 알고리즘 이름) : 암호화에 사용되는 알고리즘 -> 16진수 문자열 변환
        .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")  
        .toString("hex");
}


// 비밀번호 확인 (hash 암호화 : 단방향 암호화)
userSchema.methods.checkPassword = function (password) {
    // hashedPassword : 로그인 시에 입력한 비밀번호를 암호화 한 값
    // 유저 salt(가입시에 사용된 salt)로 암호화
    const hashedPassword = crypto
        .pbkdf2Sync(password, this.salt, 310000, 32, "sha256")
        .toString("hex")
        
    // this.password : DB에 저장된 암호화된 비밀번호
    return this.password === hashedPassword;        // 두 값 일치할 경우 로그인 성공
}


/*
    ○ 로그인 인증 처리 절차

    1. 유저가 로그인 시도
    2. 서버는 로그인에 성공한 경우 토큰 발급
    3. 클라이언트는 매 요청시에 토큰을 요청헤더에 담아 요청
*/

// 로그인 토큰 생성
userSchema.methods.generateJWT = function() {

    // paylod : 유저의 정보 (data)
    const payload = {
        sub : this._id,
        username : this.username
    }

    // secret : 로그인 토큰 생성에 사용되는 키
    // process.env : 환경변수에 접근하는 방법
    const secret = process.env.SECRET;      // .env 파일의 SECRET 정보

    // 토큰 생성 (payload를 secret을 통해 암호화)
    return jwt.sign(payload, secret);
}


// 모델 exports -> 정의한 스키마를 가지고 model()을 통해 모델 생성
// model(모델명, 스키마)
module.exports = mongoose.model("User", userSchema);