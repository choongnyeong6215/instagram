const User = require("../models/User");
const Following = require("../models/Following");
const Post = require("../models/Post");
const Likes = require("../models/Likes");
const createError = require("http-errors");


/*
    Post Controller

    1. feed - 피드 가져오기
    2. find - 게시물 여러개 찾기
    3. findOne - 게시물 상세보기
    4. create - 게시물 생성
    5. deleteOne - 게시물 삭제
    6. like - 게시물 좋아요 처리
    7. unlike - 게시물 좋아요 취소 처리
*/


exports.feed = async(req, res, next) => {
    try {
        // 게시물 검색 조건
        const followingUsers = await Following.find({user : req.user._id});     // 로그인 유저가 팔로우 하는 프로필 리스트
        const followingIds = followingUsers                                     // 프로필 리스트에서 following 필드 추출
            .map(followingUser => followingUser.following);

        const where = {user : [...followingIds, req.user._id]};                 // 검색 조건에 추가 (로그인 유저가 팔로우하는 유저 id리스트, 본인 id)

        // 더보기 기능
        const limit = req.query.limit || 5;                                     // 서버가 한번 전송할 때 보낼 도큐먼트 갯수
        const skip = req.query.skip || 0;                                       // 서버가 전송할 때 스킵할 도큐먼트 갯수

        // 게시물 검색
        const posts = await Post.find(where)
            .populate({                 // join (게시물 작성자에 대한 정보)
                path : "user",          // 게시물 작성자 정보
                select : "username avatar avatarUrl"
            })
            .populate("commentCount")   // 댓글 갯수
            .populate({
                path : "liked",         // 로그인 유저가 좋아요한 post 도큐먼트가 있는지에 대한 여부 (좋아요 여부)
                match : {user : req.user._id}
            })
            .sort({createdAt : "desc"})
            .skip(skip)
            .limit(limit)

        // 게시물 갯수 - 더보기 기능
        const postCount = await Post.countDocuments(where);

        res.json({posts, postCount});

    } catch (error) {
        next(error);
    }
};


exports.find = async(req, res, next) => {
    try {
        // 검색 조건
        const where = {};

        // 타임라인(특정 프로필 유저의 게시물) 검색조건
        if("username" in req.query) {
            const user = await User.findOne({username : req.query.username});   // 타임라인을 보고싶은 유저 검색

            if(!user) {
                throw new createError.NotFound("User is not found");
            }

            // 검색 조건 추가
            where.user = user._id;
        }

        // 검색
        const posts = await Post 
            .find(where)
            .populate("commentCount")
            .sort({createdAt : "desc"});

        // 게시물 갯수
        const postCount = await Post.countDocuments(where);

        res.json({posts, postCount});

    } catch (error) {
        next(error);
    }
};


exports.findOne = async(req, res, next) => {
    try {
        // 게시물 검색
        const post = await Post.findById(req.params.id)     // 클라이언트가 전송한 데이터(게시물 아이디)로 찾기
            .populate({
                path : "user",
                selcet : "username avatar avatarUrl"
            })
            .populate("commentCount")
            .populate({
                path : "liked",
                match : {user : req.user._id}
            })

        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        res.json({post});
            
    } catch (error) {
        next(error);
    }
};

exports.create = async(req, res, next) => {
    try {
        const files = req.files;        // 클라이언트가 전송한 이미지 파일

        if(!files || files.length < 1) {
            throw new createError.BadRequest("File is required");
        }

        // 도큐먼트 생성
        const photoNames = files.map(file => file.filename);

        const post = new Post({
            photos : photoNames,            // 사진 이름 랜덤으로 생성
            caption : req.body.caption,     // 사진 설명
            user : req.user._id
        });

        await post.save();

        res.json({post})

    } catch (error) {
        next(error);
    }
};

exports.deleteOne = async(req, res, next) => {
    try {
        // 삭제할 게시물 검색 (클라이언트가 전송한 게시물 id로 검색)
        const post = await Post.findById(req.params.id);

        if(!post) {
            throw new createError.BadRequest("Post is not found");
        }

        // 게시물 삭제 요청자와 등록자가 같은지 확인
        const isMaster = req.user._id.toString() === post.user.toString();

        if(!isMaster) {
            throw new createError.BadRequest("Incorrect User");
        }

        await post.deleteOne();

        res.json({post});


    } catch (error) {
        next(error);
    }
};

exports.like = async(req, res, next) => {
    try {
        // 좋아요할 게시물 검색
        const post = await Post.findById(req.params.id);

        if(!post) {
            throw new createError.NotFound("Post is not found");
        }

        // 이미 좋아요 누른 게시물인지 확인
        const liked = await Likes
            .findOne({user : req.user._id, post : post._id});

        // 좋아요 누르지 않은 게시물일 경우 좋아요 처리
        if(!liked) {
            const likes = new Likes({       // Likes 도큐먼트 생성
                user : req.user._id,
                post : post._id
            })

            await likes.save();

            post.likesCount++;
            
            await post.save();
        }

        res.json({post});

    } catch (error) {
        next(error);
    }
};
exports.unlike = async(req, res, next) => {};