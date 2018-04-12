var express = require('express');
var app = express();
var https = require('https');
var firebase = require('firebase');
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
var sleep = require('sleep');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
var firebaseData;
var config = {
    apiKey: "AIzaSyBTIT-Cd-3UnJkb8itpKoCRy3GNadNq-ko",
    authDomain: "esiot-d6efd.firebaseapp.com",
    databaseURL: "https://esiot-d6efd.firebaseio.com",
    projectId: "esiot-d6efd",
    storageBucket: "esiot-d6efd.appspot.com",
    messagingSenderId: "451808343597"
};

firebase.initializeApp(config);
db = firebase.database();

var ref = db.ref();
ref.once('value', function(result) {
    firebaseData = result.val();
    console.log(firebaseData);
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/views/index.html');
})

app.get('/click', function(req, res){
    console.log('clicked');
    res.redirect('/transfer_image');
});

app.post('/checkAdmin', function(req, res){
    if(req.body.passcode=='aitait')
        res.redirect('/admin');
    else
        res.send('Invalid Passcode');
});

app.get('/admin', function(req, res){
    var ref = db.ref();
    ref.once('value', function(result) {
        firebaseData = result.val();
        console.log(firebaseData);
    });
	res.render('statistics', {total, data});
});

app.get('/admin/attendance', function(req, res){
	res.render('attendance',{total,data});
});

app.get('/admin/:page', function(req, res){
	res.render(req.params.page);
});

app.post('/admin/add/data', function(req, res){
    console.log(req.body);
    var fname = req.body.rno;
    var url = 'http://35.185.1.50:8000/register/'+fname;  //cloud url
    var stud_name = req.body.fname + " " + req.body.lname;

    var req = request.get(url, function (err, resp, body) {
        if (err) {
          console.log(err);
        } else {
          console.log('Image Sent to Cloud');
        }
    });
    
    var date = new Date().getDate();
    var update = {
        [fname] : {
            "name" : stud_name,
            "date" : date,
            "attendance" : 0
        }
    }
    var ref = db.ref("attendance_count");
    ref.update(update);

	res.send('Success');
});

app.get('/transfer_image', function(req, res) {
    var file = fs.createWriteStream('captured.jpg');
    var request  = https.get("https://79791be3.ngrok.io/get_img", function(response)   {
        response.pipe(file);
        setTimeout(function(){
            res.send('success')
        }, 2000);
    })
    // setTimeout(function(){
    //     res.send('success')
    // }, 4000);
})

app.get('/get_reg_image', function(req, res) {
    var fname = req.query['name'];
    console.log(fname);
    var file = fs.createWriteStream(fname+'.jpg')
    console.log(fname);
    var request  = https.get("https://79791be3.ngrok.io/get_img", function(response)   {
        response.pipe(file);
    })
    //show image on dashboard saved on central server
})

app.get('/enroll_stud', function(req, res) {
    var fname = req.query['name'];
    var url = 'http://35.185.1.50:8000/register/'+fname;  //cloud url

    var req = request.get(url, function (err, resp, body) {
        if (err) {
          console.log(err);
        } else {
          console.log('Image Sent to Cloud');
        }
    });
})

app.get('/sendToCloud', function(req, res) {
    console.log('Send to CLoud');
    var url = 'http://35.185.1.50:8000/upload_image';  //cloud url

    var req = request.get(url, function (err, resp, body) {
        if (err) {
          console.log(err);
        } 
        else {
          console.log('Image Sent to Cloud');
          console.log(res.body);
          sleep.sleep(60);
          res.redirect('/checkInCloud');
        }
    });
});

app.get('/checkInCloud', function(req, res) {
    console.log('Check in CLoud');
    var date = new Date().getDate();
    var url = 'http://35.185.1.50:8000/identify_image'

    var req = request.get(url, function (err, resp, body) {
        if (err) {
          console.log(err);
        } 
        else {
            console.log('Image Label received from cloud');
            var response = resp.body;
            console.log(response);
            var label = "" + response[1]+response[2]+response[3]+response[4];
            console.log(label);
            //update attendance on firebase
            var lref = db.ref("total_lectures");
            lref.once('value', function(result) {
                if( parseInt(result.val()['date']) != parseInt(date) ) {

                    var update = {
                        "date" : date,
                        "lectures" : result.val()['lectures'] + 4
                    }
                    lref.update(update);
                }
            })
            
            var ref = db.ref("attendance_count");
            ref.once('value', function(result) {
                var curr_stud = result.val()[label];
                console.log(curr_stud); 
                if(curr_stud === undefined) {
                
                }
                else {
                    if(parseInt(curr_stud.date) != parseInt(date)) {
                        var update = {
                            "name" : curr_stud.name,
                            "date" : date,
                            "attendance" : parseInt(curr_stud.attendance) + 1
                        }
                        ref.child(label).update(update);
                    }
                }
            })
        }
    });
    res.send('success');
});
// ======================================================================================
app.get('/photo/capture', function(req, res){
	console.log('photo capture');
	res.sendFile(__dirname + '/captured.jpg');
});
app.get('/admin/feature/1/on', function(req, res){
    console.log('feature 1 on');
    var url = 'https://79791be3.ngrok.io/get_bgDetection';  //cloud url

    var req = request.get(url, function (err, resp, body) {
        if (err) {
          console.log(err);
        } 
        else {
            console.log('ho gya');
        }
    });
	res.send('Feature 1 on');
});

app.get('/admin/feature/1/off', function(req, res){
	console.log('feature 1 off');
	res.send('Feature 1 off');
});

app.get('/admin/feature/2/on', function(req, res){
	console.log('feature 2 on');
	res.send('Feature 2 on');
});

app.get('/admin/feature/2/off', function(req, res){
	console.log('feature 2 off');
	res.send('Feature 2 off');
});
// ========================================================================================
app.listen(8000, function() {
    console.log('Server up and running...');
});

//test data
var total = 30;
var data = [
    {
        roll: 3325,
        name: 'Niraj Singh',
        attended: 25
    },{
        roll: 3326,
        name: 'Nishant Gore',
        attended: 21
    }
];

var updateData = function(){
    var temp = firebaseData;
    total = temp.total_lectures.lectures;
    var rolls = Object.keys(temp.attendance_count);
    data = [];
    for(var i=0;i<rolls.length;++i){
        var tempobj = {};
        tempobj.roll = rolls[i];
        tempobj.name= temp.attendance_count[rolls[i]].name;
        tempobj.attended= temp.attendance_count[rolls[i]].attendance;
        data.push(tempobj);
    }
    console.log(total + " " + rolls);
    console.log(data);
}
setTimeout(function(){
    setInterval(updateData, 20000);
}, 5000);
