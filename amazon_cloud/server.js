var express = require('express');
var http = require('http');
var fs = require('fs');

var app = express();

app.get('/identify_image', function (req, res) {

    var file = fs.createWriteStream("unknown.jpg");
    var request = http.get("pi-url/get_img", function (response){
        response.pipe(file);
    })
    label = ""
   //Shell script to get label

   return label;
});

app.get('/register', function (req, res) {

    var name = req.query['name'];
    console.log(name);

    var file = fs.createWriteStream("known/"+name+".jpg"); //Check directory

    var request = http.get("pi-url/get_img", function (response){
        response.pipe(file);
    })

    return "Successfully enrolled : " + name;
});


app.listen(8000, function() {
    console.log('Server up and running...');
});