const express = require("express");
const router = express.Router();
const {
    find,
    findOne,
    follow,
    unfollow
} = require("../controllers/profileController");


// 라우팅
router.get("/", find);
router.get("/:username", findOne);
router.post("/:username/follow", follow);
router.delete("/:username/unfollow", unfollow);


// 라우터 exports
module.exports = router;