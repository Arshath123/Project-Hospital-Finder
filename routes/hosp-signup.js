const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const router = express.Router();

router.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/hospital_sign_up.html'));
});

exports.form = router;

exports.post_form = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        let hospitals = {
            "userName": req.body.user_name,
            "name": req.body.name,
            "phone": req.body.phone,
            "amb": req.body.amb,
            "district":req.body.district,
            "address": req.body.address,
            "email": req.body.email,
            "password": hash
        };
        db.query('select * from hospital where hospital_id = ? or email = ?', [hospitals.userName, hospitals.email], (err, result) => {
            if (err)
                res.send('<h1>...Some error...</h1>');
            if (!result[0]) {
                db.query('INSERT INTO hospital values(?,?,?,?,?,?,?,?)', [hospitals.userName, hospitals.name, hospitals.phone, hospitals.amb,hospitals.address, hospitals.email, hospitals.password,hospitals.district]);
                res.redirect('/');
            }
            else{
                res.send('<h1>...Hospital Already Exists...</h1>');
            }
        });
    });
}