const Post = require("../models/Post");
const Comment = require("../models/Comment");
const createError = require("http-errors");


/*
    Comment Controller

    1. find - 댓글 가져오기
    2. craete - 댓글 생성
    3. deleteOne - 댓글 삭제
*/


exports.find = async(req, res, next) => {
    try {
        // 댓글 가져올 게시물 검색
        const post = await Post.findById(req.params.id);

        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        // Comment 컬렉션 검색 조건
        const where = {post : post._id};

        const comments = await Comment
            .find(where)
            .populate({
                path : "user",
                select : "username avatar avatarUrl"
            })
            .sort({createdAt : "desc"});

        // 댓글 갯수
        const commentCount = await Comment.countDocuments(where);

        res.json({comments, commentCount});

    } catch (error) {
        next(error);
    }
};

exports.create = async(req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 댓글 생성
        const comment = new Comment({
            content : req.body.content,     // 댓글 내용
            post : post._id,
            user : req.user._id             // 댓글 작성자
        });

        await comment.save();

        // user 필드 조인 (도큐먼트 생성 후 조인)
        await comment.populate({
            path : "user",
            select : "username avatar avatarUrl"
        });

        res.json({comment});

        await post.save();

    } catch (error) {
        next(error);
    }
};

exports.deleteOne = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if(!comment) {
            throw new createError.NotFound("Comment is not found");
        }

        // 로그인 유저 본인이 작성한 댓글인지 확인
        const isMaster = req.user._id.toString() === comment.user.toString();

        if(!isMaster) {
            throw new createError.BadRequest("this comment is not yours");
        }

        await comment.deleteOne();
        
        res.json({comment});

    } catch (error) {
        next(error);
    }
};