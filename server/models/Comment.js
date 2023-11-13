const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {DateTime} = require("luxon");

// Comment 스키마
const commentSchema = new Schema({
    content : {type : String},                                          // 댓글의 내용
    post : {type : Schema.ObjectId, required : true},                   // 댓글을 단 게시물
    user : {type : Schema.ObjectId, required : true, ref : "User"},     // 댓글의 작성자 (User 모델 참조)
}, {
    timestamps : true,                                                  // 도큐먼트 생성 시간
    toJSON : {virtuals : true},                                         // 데이터 전송시에 필요한 옵션
    toObject : {virtuals : true}
})


// 가상 필드

// 보여주기용 날짜-
commentSchema.virtual("displayDate").get(function () {
    
    // 타임스탬프(createdAt) 가공해 보여주기용 날짜 생성
    const displayDate = DateTime
        .fromJSDate(this.createdAt)
        .toLocaleString(DateTime.DATE_MED);

    return displayDate;
})


// 모델 exports
module.exports = mongoose.model("Comment", commentSchema);