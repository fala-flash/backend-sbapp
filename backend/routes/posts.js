const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// add post
router.post('/addpost',  passport.authenticate('jwt', {session: false}), (req, res, next) => {
    let newPost = new Post({
        text: req.body.text,
        date: req.body.date,
        time: req.body.time,
        authorID: req.body.authorID,
        authorName: req.body.authorName,
        authorEmail: req.body.authorEmail,
        authorTel: req.body.authorTel
    });

    Post.addPost(newPost, (err, post) => {
        if (err) {
            res.json({success: false, msg:'Failed to add post'});
        } else {
            res.json({success: true, msg:'Post added'});
        }
    });
});

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


//get all user posts
router.get('/personal-blog/:userid', passport.authenticate('jwt', {session: false}), (req, res) => {
    let userID = req.params.userid;
    Post.find({"authorID": userID}, (err, posts) => {
        if (!err) {
            res.json(posts);
        }
        else {
            res.json({success: false, msg:'Unauthorized'});
            next();
        }
    });
});

module.exports = router;