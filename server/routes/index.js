const express = require("express");
const router = express.Router();              // 라우터

const userRouter = require("./user");         // 하위 라우터 목록
const postRouter = require("./post");
const commentRouter = require("./comment");
const profileRouter = require("./profile");

const auth = require("../middleware/auth");   // 인증처리 미들웨어


// 인덱스 페이지 (가장 먼저 보게될 페이지)
router.get("/", (req, res) => {
  res.json({message : "hello client"});       // 서버의 응답
})


// 라우터 통합

// User Router
router.use("/users", userRouter);             // userRouter 연결 시 /users로 고정

// Post Router
router.use("/posts", auth, postRouter);       // 인증해야 접근할 수 있는 라우터 (보호된 라우터)

// Comment Router
router.use("/posts", auth, commentRouter);

// Profile Router
router.use("/profiles", auth, profileRouter);


// 인덱스 라우터 exports
module.exports = router;