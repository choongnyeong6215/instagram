const express = require("express");
const router = express.Router();
const {                                             // Post Controller 호출
    feed,
    find,
    create,
    findOne,
    deleteOne,
    like,
    unlike
} = require("../controllers/postController");
const upload = require("../middleware/upload");     // 파일처리 미들웨어
const { route } = require("./User");


// 라우팅
router.get("/feed", feed);
router.get("/", find);
router.post("/", upload.array("photos", 10), create);
router.get("/:id", findOne);
router.delete("/:id", deleteOne);
router.post("/:id/like", like);
router.delete("/:id/unlike", unlike);


// 라우터 exports
module.exports = router;