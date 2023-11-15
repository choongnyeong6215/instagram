const express = require("express");
const router = express.Router();                                    // express가 제공하는 라우터
const {                                                             // User Controller
    create,
    login,
    update
} = require("../controllers/userController");
const signUpValidator = require("../middleware/signUpValidator");   // middleware
const loginValidator = require("../middleware/loginValidator");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");


/*
    라우팅 구조

    router.httpRequestMethod(url, middlewares, controller)

*/

// 라우팅
router.post("/", signUpValidator, create);
router.post("/login", loginValidator, login);
router.put("/user", auth, upload.single("avatar"), update);


// 라우터 exports
module.exports = router;