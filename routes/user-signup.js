const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const router = express.Router();

router.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/usersignup.html'));
});

exports.form = router;

exports.post_form = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var users = {
            "userName": req.body.user_name,
            "name": req.body.name,
            "phone": req.body.phone,
            "blood": req.body.blood,
            "email": req.body.email,
            "password": hash
        }
        db.query('select * from patient where userid = ? or email_id = ?', [users.userName, users.email], (err, result) => {
            if (err)
                res.send('<h1>...Some error...</h1>');
            if (!result[0]) {
                db.query('INSERT INTO patient values(?,?,?,?,?,?)', [users.userName, users.name, users.phone, users.blood, users.email, users.password]);
                res.redirect('/');
            }
            else{
                res.send('<h1>...User Already Exists...</h1>');
            }
        });
    });
};

