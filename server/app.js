const express = require("express");                 // 서버 프레임 워크
const createError = require("http-errors");         // 에러 처리 기능
const cookieParser = require("cookie-parser");      // 쿠키 수집 기능
const logger = require("morgan");                   // 통신 기록 저장 및 출력
const cors = require("cors");                       // CORS 기능 제공
const indexRouter = requrie("./routes/index");      // 인덱스 Router
const app = express();                              // 앱 모듈
const mongoose = requrie("mongoose");               // 몽고 DB용 ODM
const compression = require("compression");         // 압축 기능 제공
const helmet = require("helmet");                   // 요청 헤더 보안 기능
require("dotenv").config();                         // 환경변수 사용환경 제공


// 데이터베이스 연결
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.MONGODB_URI)               // 환경변수에 작성된 몽고DB 주소로 연결
    .catch(err => console.log(err));


// 앱레벨 미들웨어 호출
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use(compression());
app.use(helmet.crossOriginResourcePolicy({
    policy : "cross-origin"
}));
app.use(cors());


// 파일 저장 경로 설정
app.use("/api/static", express.static("public"));   // 서버의 파일 저장 경로
app.use("/api/files", express.static("files"));     // 클라이언트가 업로드한 파일 저장 경로(파일 서버의 역할)


// 인덱스 라우터 호출
app.use("/api", indexRouter);


// 에러 처리

// 404 에러 처리
app.use((req, res, next) => {
    const err = new createError.NotFound("Invalid URL");

    next(err);              // 에러 핸들러에게 에러 전달
})

// 에러 핸들러
app.use((err, req, res, next) => {
    console.error(err);     // 에러 출력
    // 서버의 응답
    // res.status(상태코드).json(클라이언트에게 전송할 데이터)
    res.status(err.status || 500).json(err.message);
})


// 앱 모듈 exports
module.expors = app;