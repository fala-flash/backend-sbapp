const mongoose = require('mongoose');

// post schema
const PostSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        require: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    authorID: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        required: true
    },
    authorTel: {
        type: Number,
        required: true
    },
    authorRole: {
        type: String,
        required: true
    },
    comments: [{ postId: String, text: String, date: String, time: String, author: String, authorid: String, role: String, sentiment: String}]
});


const Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.addPost = function(newPost, callback){
    newPost.save(callback());
}

module.exports.getPostById = function(id, callback){
    Post.findById(id, callback);
}

module.exports.getCommentById = function(id, callback) {
    const query = {"comments._id": id};
    Post.findOne(query, callback);
}