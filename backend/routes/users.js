const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// register
router.post('/register', (req, res, next) => {

    const email = req.body.email;
    
    User.getUserByEmail(email, (err, user) => {
        if(err) throw error;
        if (user) {
            return res.json({success: false, msg:"L'utente esiste già"});
        } else {
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                tel: req.body.tel,
                password: req.body.password,
                role: req.body.role
            });
        
            User.addUser(newUser, (err, user) => {
                if (err) {
                    res.json({success: false, msg:"Errore durante la registrazione"});
                } else {
                    res.json({success: true, msg:"Utente registrato"});
                }
            });
        }
    })
});

// authenticate
router.post('/authenticate', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.getUserByEmail(email, (err, user) => {
        if(err) throw err;
        if (!user) {
            return res.json({success: false, msg:'Utente non trovato'});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
           if(err) throw err;
           if (isMatch) {
               const token = jwt.sign(user.toJSON(), config.secret, {
                   expiresIn: 604800 // 1 week
               });
               res.json({
                  success: true,
                  msg: "Benvenuto",
                  token: 'JWT '+token,
                  user: {
                      id: user._id,
                      name: user.name,
                      tel: user.tel,
                      email: user.email,
                      role: user.role
                  }
               });
           } else {
            return res.json({success: false, msg:'Password errata'});
           }
        });
    });
});

// profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({
        user: req.user
    });
});



module.exports = router;