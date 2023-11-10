const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// schema
const followingSchema = new Schema({
    user : {type : Schema.ObjectId, required : true},       // 팔로우 한 유저
    following : {type : Schema.ObjectId, required : true}   // 팔로우 받은 유저
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})


// model exports
module.exports = mongoose.model("Following", followingSchema);