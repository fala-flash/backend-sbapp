const mongoose = require('mongoose');

// post schema
const PostSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
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
});


const Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.addPost = function(newPost, callback){
    newPost.save(callback());
}