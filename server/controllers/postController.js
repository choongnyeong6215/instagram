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


exports.feed = async(req, res, next) => {};
exports.find = async(req, res, next) => {};
exports.findOne = async(req, res, next) => {};
exports.create = async(req, res, next) => {};
exports.deleteOne = async(req, res, next) => {};
exports.like = async(req, res, next) => {};
exports.unlike = async(req, res, next) => {};