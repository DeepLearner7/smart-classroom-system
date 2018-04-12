var express = require('express');
var request = require('request');
var PythonShell = require('python-shell')


var https = require('https');

var app = express();

app.use("/js",  express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/fonts",  express.static(__dirname + '/fonts'));
app.use("/images",  express.static(__dirname + '/images'));

app.get('/', function (req, res) {
   res.sendFile('index.html', { root: __dirname  } );
});

app.get('/index.html', function (req, res) {
   res.sendFile('index.html', { root: __dirname  } );
});


app.get('/get_img', function(req, res){
   console.log("Request recieved");
   return new Promise(function(resolve, reject) {
       PythonShell.run('capture_image.py',function(err){
           if(err) throw err;
           console.log('Script executed successfully');
           resolve('Success');
       })
   }).then((response)=>{
       res.sendFile('captured.jpg', {root: __dirname});
       console.log(response);
   })
});


app.listen(3000, function() {
   console.log('Server up and running...');
});