const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {DateTime} = require("luxon");        // 날짜 데이터 가공 기능
const Comment = require("./Comment");       // Comment 모델
const Likes = require("./Likes");           // Likes 모델


// Post 스키마
const postSchema = new Schema({
    photos : [{type : String, required : true}],                        // 사진의 이름 - 사진이 여러장일 수 있으므로 배열에 저장
    caption : {type : String},                                          // 사진에 대한 설명
    user : {type : Schema.ObjectId, required : true, ref : "User"},     // 게시물 작성자 (Schema.ObjectId : 컬렉션 조합 - 게시물 작성자 정보 알기 위해 User 모델 참조)
    likesCount : {type : Number, default : 0},                          // 좋아요 갯수
}, { 
    timestamps : true,                                                  // 도큐먼트(컬렉션 내의 각각의 데이터 - db 튜플 개념) 생성 시간 자동으로 저장되도록 정의 - 게시물 생성 시간 db 저장
    toJSON : {virtuals : true},                                         // 데이터 전송에 사용되는 옵션 (가상 필드 추가로 전송)
    toObject : {virtuals : true}
})


// 가상 필드
// virtual() -> 첫번째 인자 : 가상 필드 이름
// get() : 필드 가공
// get() x : 컬렉션 조합


// 보여주기용 날짜 (필드 가공)
postSchema.virtual("displayDate").get(function () {

    // 타임스탬프(createdAt) 가공해 보여주기용 날짜 생성
    const displayDate = DateTime
        .fromJSDate(this.createdAt)
        .toLocaleString(DateTime.DATE_MED);

    return displayDate;
})


// 사진 URL (필드 가공)
postSchema.virtual("photoUrls").get(function () {
    // 완성된 사진 url 제공
    const urls = this.photos.map(photoName => {
        return process.env.FILE_URL + "/photos/" + photoName
    })

    return urls;
})


// 댓글 개수 (컬렉션 조합)
postSchema.virtual("commentCount", {
    ref : "Comment",        // Comment 컬렉션 참조
    localField : "_id",
    foreignField : "post",
    count : true
})


// 로그인 유저의 좋아요 여부
postSchema.virtual("liked", {
    ref : "Likes",          // Likes 모델 참조
    localField : "_id",
    foreignField : "post",
    justOne : true
})


// 모델 exports -> 정의한 스키마를 가지고 model()을 통해 모델 생성
// model(모델명, 스키마)
module.exports = mongoose.model("Post", postSchema);