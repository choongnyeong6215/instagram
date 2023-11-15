const express = require("express");
const router = express.Router();
const {
    find,
    create,
    deleteOne
} = require("../controllers/commentController");


// 라우팅
router.get("/:id/comments", find);
router.post("/:id/comments", create);
router.delete("/comments/:id", deleteOne);


// 라우터 exports
module.exports = router;