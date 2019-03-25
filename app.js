const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const handleBars = require('express-handlebars');

const signup_user = require('./routes/user-signup');
const signup_hosp = require('./routes/hosp-signup');
const login_user = require('./routes/user-login');
const login_hosp = require('./routes/hosp-login');

const app = express();

app.engine('hbs',handleBars());
app.set('view engine','hbs');
app.set('views','views');

app.use(express.static('views'));

app.use(bodyParser.urlencoded({ extended: false }));

//User Signup
app.get('/user-signup', signup_user.form);
app.post('/user-signup', signup_user.post_form);

//Hospital Signup
app.get('/hospital-signup', signup_hosp.form);
app.post('/hospital-signup', signup_hosp.post_form);

//User login
app.post('/user-welcome', login_user.authentication);
app.post('/display-hospitals', login_user.display_hospitals);//Display hospitals based on location
app.post('/sort', login_user.sorts);
app.post('/specialization', login_user.spec);
app.post('/ambulance', login_user.ambulance);
app.get('/display-doctors/:id', login_user.display_doctors);
app.get('/appointment/:id', login_user.appointment);

//Hospital login
app.post('/hospital-welcome', login_hosp.authentication);
app.post('/welcome-hos', login_hosp.hospital_welcome);
app.get('/register-doctor', login_hosp.register_doctor);
app.get('/update-availability', login_hosp.update_availability);
app.post('/post-update-availability', login_hosp.post_update_availability);

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen('3306');
