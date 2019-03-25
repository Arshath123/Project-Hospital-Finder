const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const app = express();

exports.authentication = (req,res,next)=>{
    var email = req.body.email;
    db.query('SELECT * FROM hospital_login WHERE email = ?', [email], function (error, results, fields) {
        if (results.length > 0) {
            bcrypt.compare(req.body.pass, results[0].password, (err, result) => {
                if (result) {
                    app.locals.email=email;
                    res.sendFile(path.join(__dirname,'../views/hospital_page.html'));
                }
                else {
                    res.send('<h1>Authentication Failed</h1>');
                }
            })
        }
    });
};

exports.hospital_welcome = (req, res, next) => {
    let doctors = {
        "id": req.body.id,
        "name": req.body.name,
        "rating": req.body.rating,
        "spec": req.body.spec,
        "degree": req.body.degree,
        "age": req.body.age
    };
    db.query('select * from doctor where doctor_id = ?', [doctors.id], (err, result) => {
        if (err)
            res.send('<h1>...Some error...</h1>');
        else if (!result[0]) {
            db.query('INSERT INTO doctor (doctor_id,name,rating,specialization,degree,age) values(?,?,?,?,?,?)', [doctors.id, doctors.name, doctors.rating, doctors.spec, doctors.degree, doctors.age]);
            if (app.locals.email) {
                db.query('SELECT hospital_id FROM HOSPITAL WHERE EMAIL = ?', [app.locals.email], (err, result) => {
                    if (err) {
                        res.send('<h1>....Some Error....</h1>')
                    }
                    else if (result) {
                        db.query('INSERT INTO NOTIFY VALUES (?,?)', [result[0].hospital_id, doctors.id]);
                        res.sendFile(path.join(__dirname, '../views/hospital_page.html'));
                    }
                });
            }
            else {
                res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');
            }
        }
        else {
            res.send('<h1>...Doctor Already Exists...</h1>');
        }
    });
};

exports.register_doctor = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../views/doctor_sign_up.html'));
};

exports.update_availability = (req, res, next) => {
    if (app.locals.email) {
        db.query('CALL doc_hospitals_email(?)', [app.locals.email], (err, result) => {
            const r = result[0];
            res.render('update_doc', { title: 'Update Doctor', r});
        })
    }
    else
        res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');
};

exports.post_update_availability = (req, res, next) => {
    let a = req.body;
    for (const [doctor_id, availability] of Object.entries(a)) {
        db.query('update doctor set availability = ? where doctor_id = ?',[availability,Number(doctor_id)],(err,result)=>{
                
        });
    }
    res.sendFile(path.join(__dirname, '../views/hospital_page.html'));
};