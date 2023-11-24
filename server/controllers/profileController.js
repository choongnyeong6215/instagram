const User = require("../models/User");
const Following = require("../models/Following");
const createError = require("http-errors");


/*
    Profile Controller

    1. find - 프로필 여러개 찾기
    2. findOne - 프로필 상세 보기
    3. follow - 팔로우 처리
    4. unfollow - 언팔로우 처리
*/

exports.find = async(req, res, next) => {
    try {
        // 검색조건 저장
        const where = {};

        // 프로필 유저가 팔로우하는 유저리스트 검색 조건
        if("following" in req.query) {                                   // 요청 쿼리 파라미터에 following 있는 경우
            const user = await User
                .findOne({username : req.query.following});             // 유저가 전송한 데이터로 유저 검색

            if(!user) {
                throw new createError.NotFound("Profile is not found");
            }

            const followingUsers = await Following                      // Following 컬렉션 검색
                .find({user : user._id})

            const followingIds = followingUsers                         // 검색결과에서 following 필드 추출
                .map(followingUser => followingUser.following);
            
            where._id = followingIds;   // 추출한 필드 결과 검색조건에 추가
        }

        // 프로필 유저를 팔로우하는 유저리스트 검색 조건
        if("followers" in req.query) {
            const user = await User
                .findOne({username : req.query.followers});

            if(!user) {
                throw new createError.NotFound("Profile is not found");
            }

            const followers = await Following
                .find({following : user._id})

            const followerIds = followers.map(follower => follower.user);   // user 필드 추출
            
            where._id = followerIds;
        }

        // 특정 글자를 포함하는 유저리스트 검색 조건
        if("username" in req.query) {
            const patt = new RegExp(req.query.username, "i");              // new RegExp(패턴, 옵션) - 대소문자 구별 X

            where.username = patt;      // 검색조건에 패턴 추가
        }

        // 검색결과에서 추출할 필드
        const profileFields =  "username name avatar avatarUrl bio";

        // select
        const profiles = await User
            .find(where, profileFields) // 조건
            .populate({                 // 컬렉션 조인
                path : "isFollowing",
                match : {user : req.user._id}
            })
        
        // 검색 결과 갯수
        const profileCount = await User.countDocuments(where);          // Model.countDocuments(조건) : 조건에 맞는 도큐먼트 갯수 구하기

        res.json({profiles, profileCount});
        
    } catch (error) {
        next(error);
    }
};


exports.findOne = async(req, res, next) => {
    try {
        // 도큐먼트에서 추출할 필드
        const profileFields = "username name avatar avatarUrl bio";

        // 프로필 검색
        const profile = await User
            .findOne({username : req.params.username}, profileFields)   // 클라이언트가 전송한 아이디
            .populate("postCount")
            .populate("followerCount")
            .populate("followingCount")
            .populate({                                                 // 로그인 유저가 프로필 유저를 팔로우 하는지 여부
                path : "isFollowing",
                match : {user : req.user._id}
            })

        // 프로필 존재하지 않을 경우
        if(!profile) {
            throw new createError.NotFound("Profile is not found");
        };

        res.json({profile});

    } catch (error) {
        next(error);
    }
};

exports.follow = async(req, res, next) => {
    try {
        const profileFields = "username name avatar avatarUrl bio";

        // 팔로우할 프로필 검색
        const profile = await User
            .findOne({username : req.params.username}, profileFields);
            
        // 프로필 존재하지 않을 경우
        if(!profile) {
            throw new createError.NotFound("profile is not found");
        }

        // 클라이언트의 아이디와 클라이언트가 요청한 아이디가 같을 경우 (본인 계정 팔로우 하려는 경우)
        if(req.user.username === req.params.username) {
            throw new createError.BadRequest("Cannot follow yourself");
        }

        // 이미 팔로우중인지 확인
        const isFollowing = await Following
            .findOne({user : req.user._id, following : profile._id});

        // 팔로우중 아닐 경우 팔로우 처리
        if(!isFollowing) {
            const following = new Following({
                user : req.user._id,
                following : profile._id
            })

            await following.save();
        }

        res.json({profile});

    } catch (error) {
        next(error);
    }
};

exports.unfollow = async(req, res, next) => {
    try {
        const profileFields = "username name avatar avatarUrl bio";

        // 언팔로우할 프로필 검색
        const profile = await User
            .findOne({username : req.params.username}, profileFields);      // 클라이언트가 전송한 username

        // 프로필이 존재하지 않을 경우
        if(!profile) {
            throw new createError.NotFound("Profile is not found");
        }

        // 현재 팔로우 중인지 확인
        const isFollowing = await Following
            .findOne({user : req.user._id, following : profile._id});

        if(isFollowing) {
            await isFollowing.deleteOne();      // 한개의 도큐먼트 삭제
        }

        res.json({profile});
        
    } catch (error) {
        next(error);
    }
};