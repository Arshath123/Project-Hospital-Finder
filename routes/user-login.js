const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

const db = require('../database/db');

const app = express();

exports.authentication = (req, res, next) => {
    var email = req.body.user;
    app.locals.email = req.body.user;
    db.query('SELECT * FROM hoser_login WHERE email_id = ?', [email], function (error, results, fields) {
        if (results.length > 0) {
            bcrypt.compare(req.body.pass, results[0].password, (err, result) => {
                if (result) {
                    res.sendFile(path.join(__dirname,'../views/index1.html'));
                }
                else {
                    res.send('<h1>Authentication Failed</h1>');
                }
            })
        }
        else {
            res.send('<h1>Authentication Failed</h1>');
        }
    });
};

exports.display_hospitals = (req,res,next) =>{
    app.locals.loc = req.body.location;
    if(app.locals.loc){ 
        db.query('CALL hosp_location_registered(?)', [app.locals.loc],(err,result)=>{
            const r = result[0];
            db.query('CALL average_in_a_city(?)', app.locals.loc,(err,result)=>{
                const average = result[0];
                res.render('listing', { title: app.locals.loc,r});  
            })
        })
    }
    else
        res.redirect('/');
};

exports.sorts = (req,res,next) =>{
    const loc = app.locals.loc;
    if(loc){ 
        db.query('CALL sort_by_no_of_doctors(?)', [loc], (err, result) => {
            const r = result[0];
            res.render('listing', { title: loc, r});
        })
    }
    else
        res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');
};

exports.spec = (req, res, next) => {
    const loc = app.locals.loc;
    if(loc)
        db.query('call hos_spec(?,?)', [req.body.spec,loc],(err,result)=>{
            const r = result[0];
            res.render('listing', { title: loc, r});
        })
    else
        res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');
};

exports.ambulance = (req,res,next) =>{
    const loc = app.locals.loc;
    if (loc)
        db.query('call ambulance_facility(?)', [loc], (err, result) => {
            const r = result[0];
            res.render('listing', { title: loc, r });
        })
    else
        res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');


}

exports.display_doctors = (req, res, next) => {
    db.query('CALL doc_hospitals(?)', [req.params.id], (err, result) => {
        if(result){ 
            const r = result[0];
            res.render('detail',{title:'Doctors',r});
        }
    });
};

exports.appointment = (req, res, next) => {
    let user = app.locals.email;
    let doctor_id = req.params.id;
    if(user && doctor_id){ 
        db.query('select userid from patient where email_id = ?',[user],(err,result)=>{
            db.query('insert into appointment values(?,?)',[doctor_id,result[0].userid]);
            res.send('<h1>Thanks for using our service</h1>');
        })
    }
    else    
        res.send('<h1>.....Login Again...Dont click reload or refresh.....</h1>');
};