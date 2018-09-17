var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var promise = require("bluebird");
mongoose.connect('mongodb://localhost:27017/symth',{
                user: 'symth',
		pass: 'symth',
                useNewUrlParser: true
            });

var mysql      = require('mysql');
var connectionMysql = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'symth'
});

mongoose.connection.on('connected', function () {
    console.log('db connected');
});
  
var Schema = mongoose.Schema;
var User;

var UserSchema = new Schema({
    email                   : { type: String, index: true, unique: true, required: true },
    salt                    : { type: String, required: false},
    hash                    : { type: String, required: false},
    userType                : { type: String, default: '1'  }, //1 Actor, 2 Actress
    firstName               : { type: String, default: '' },
    lastName                : { type: String, default: '' },
    dob                     : { type: String, default: '' },
    phone                   : { type: String, default: '' },
    gender                  : { type: String, default: '' },
    height                  : { type: String, default: '' },
    weight                  : { type: String, default: '' },
    ethnicity               : { type: String, default: '' },
    hairColor               : { type: String, default: '' },
    allergies               : { type: String, default: '' },
    medicalCondition        : { type: String, default: '' },
    eyeColor                : { type: String, default: '' },
    status                  : { type: Number, default: '0', min :0, max :1 },//0 inactive, 1 active , 2 deleted 
    fullBodyShot            : { type: String, default: '' },
    headShot                : { type: String, default: '' },
    selfVideo               : { type: String, default: '' },
    profileImages           : [String],
    workshop                : { type: Schema.Types.ObjectId, ref: 'workshop' },
    stripeConnectedAccount  : { type: String, default: '' },
    stripeCostumer          : { type: String, default: '' },
    reset_token             : { type: String, default: '' },
    created                 : { type: Date, default: Date.now },
    updated                 : { type: Date, default: Date.now },
    is_deleted              : { type: Number, default: 0},
});

//Export user module
User = module.exports = mongoose.model('User', UserSchema);
/*module.exports = rootRef*/

connectionMysql.connect();
 

/* GET users listing. */
router.get('/', function(req, res, next) {
    var Promisekey=[];
  connectionMysql.query('SELECT * FROM `wp_users` JOIN smyth_profiles ON wp_users.ID = smyth_profiles.user_id', function (error, results, fields) {
  if (error) throw error;
    console.log('row count : ',results.length);
    results.forEach(function(UserData){
//        console.log(UserData);
//        console.log(UserData.user_email);
//        console.log('====');
          let userInfo={};
    userInfo.email                   = UserData.user_email;
//    userInfo.salt                    = 
    userInfo.hash                    = UserData.user_pass;
//    userInfo.userType                = 
    userInfo.firstName               = UserData.first_name;
    userInfo.lastName                = UserData.last_name;
    userInfo.dob                     = UserData.age;
    userInfo.phone                   = UserData.phone_home;
    userInfo.gender                  = UserData.gender;
    userInfo.height                  = UserData.height;
    userInfo.weight                  = UserData.weight;
    userInfo.ethnicity               = UserData.ethnicity;
    userInfo.hairColor               = UserData.hair_colour;
//    userInfo.allergies               = ;
    userInfo.medicalCondition        = UserData.medical_condition;
    userInfo.eyeColor                = UserData.eye_colour;
    userInfo.status                  = 1;
//    userInfo.fullBodyShot            = ;
//    userInfo.headShot                = ;
//    userInfo.selfVideo               = ;
//    userInfo.profileImages           = ;
//    userInfo.workshop                = ;
//    userInfo.stripeConnectedAccount  = 
//    userInfo.stripeCostumer          = 
//    userInfo.reset_token             = 
        console.log(userInfo);
        var user=new User(userInfo);
    Promisekey.push(user.save())
    })
  }); 

promise.all(Promisekey)
.then(function (result) {
    console.log('=>',result);
})
.catch(function (err) {
   console.log('=======ERROR======',err);
   //reject(err);
})
  res.send('respond with a resource');
});

module.exports = router;
