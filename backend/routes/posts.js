const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const sentiment = require('multilang-sentiment');


//sentiment analysis
function analysis(text) {
    let result;
    let r = sentiment(text, 'it');
    if (r.comparative >= 0) {
        result = 'positivo/neutro';
    } else {
        result = 'negativo';
    }

    return result;
}





// add post
router.post('/addpost',  passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let newPost = new Post({
        text: req.body.text,
        sentiment: analysis(req.body.text),  //sentiment analysis
        date: req.body.date,
        time: req.body.time,
        authorID: req.body.authorID,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        authorTel: req.body.authorTel,
        comments: req.body.comments
    });

    Post.addPost(newPost, (err, post) => {
        if (err) {
            res.json({success: false, msg:"Errore durante l'invio della segnalazione"});
        } else {
            res.json({success: true, msg:'Segnalazione inviata'});
        }
    });
});

//comment a post
router.post('/blog/comment/:postid',passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let postID = req.params.postid;

    let commentData = {
        text: req.body.text,
        sentiment: analysis(req.body.text),  //sentiment analysis
        date: req.body.date,
        time: req.body.time,
        author: req.body.author,
        authorid: req.body.authorid
    };

    Post.updateOne({ "_id": postID },{ "$push": { "comments": commentData } }, (err, comment) => {
        if (err) {
            res.json({success: false, msg:"Errore durante l'invio del commento"});
        } else {
            res.json({success: true, msg:'Commento aggiunto'});
        }
    })

})



//get all posts
router.get('/blog', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.find({}, (err, posts) => {
        if (!err) {
            res.json(posts);
        }
        else {
            res.json({success: false, msg:'Unauthorized'});
            next();
        }
    });
});




//get all user posts and posts with his comment
router.get('/personal-blog/:userid', passport.authenticate('jwt', {session: false}), (req, res) => {
    let userID = req.params.userid;
    Post.find({ $or:[ {"authorID": userID}, {"comments.authorid": userID} ]}, (err, posts) => {
        if (!err) {
            res.json(posts);
        }
        else {
            res.json({success: false, msg:'Unauthorized'});
        }
    });
});




module.exports = router;