const request = require("request");
const async = require("async");
const wait=require('wait.for');
const mongoose = require('mongoose');
User = mongoose.model('User');
global.emotions={};

var mongoUri = 'mongodb://omi23.vaidya:Omkar23..@ds217898.mlab.com:17898/pofh';
mongoose.connect(mongoUri);
var db = mongoose.connection;
console.log(db);
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

// exports.findAll = function(req, res){
//   User.find({},function(err, results) {
//     return res.send(results);
//   });
// };

// exports.add = function(req, res) {
//   console.log(req);
//     db.collections.users.save(
//       {user: req.query}
//     );
//     res.end();
// };

function googleVision(imageUrl) {
  const vision = require('@google-cloud/vision');
  console.log(imageUrl);
  var image = imageUrl;
  var joy=[];
  var anger=[];
  var sorrow=[];
  var surprise=[];
  global.emotions={};

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: '/Users/GrayShadow/Documents/emot/emot-bd1bbb7c4647.json'
  });

  client
    .faceDetection(image)
    .then(results => {
      const faces = results[0].faceAnnotations;

      //console.log('Faces:');
      faces.forEach((face, i) => {
        joy.push(face.joyLikelihood);
        anger.push(face.angerLikelihood);
        sorrow.push(face.sorrowLikelihood);
        surprise.push(face.surpriseLikelihood);
      });
      //console.log(joy);
      global.emotions['joy']=joy;
      global.emotions['anger']=anger;
      global.emotions['sorrow']=sorrow;
      global.emotions['surprise']=surprise;
      JSON.stringify(global.emotions);
      if(joy.length>0 && anger.length>0 && sorrow.length>0 && surprise.length>0){
        //console.log(emotions);
      }
      console.log(global.emotions);
      sendData(image);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  }

function sendData(imageUrl){
  joy=global.emotions['joy'];
  anger=global.emotions['anger'];
  sorrow=global.emotions['sorrow'];
  surprise=global.emotions['surprise'];
  
  JSON.stringify(global.emotions);
  console.log(global.emotions);
  if(joy.length>0 && anger.length>0 && sorrow.length>0 && surprise.length>0){
    console.log('hello');
    console.log(db);
    db.collections.users.save(
      {imageurl:imageUrl, emotions:global.emotions}
    );
    console.log('updated');
  }
}

function getImages(accessToken){
  var url="https://api.instagram.com/v1/users/self/media/recent/?access_token=1537371331.0522f23.e7f4e7d7c3994192b1f519f445ddba5e";
  var emo=[];
  var imageUrl;
  request.get(url, (error, response, body) => {
    let json = JSON.parse(body);
    for(var i=0; i<json.data.length; i++)
    {
      imageUrl=json.data[i].images.standard_resolution.url;
      googleVision(imageUrl);
      console.log(global.emotions);
      emo.push({imageUrl:imageUrl, emotions:global.emotions});
    }
    JSON.stringify(emo);
    //console.log('hello'+emo);
  });
}

exports.incomingRequest = function(req, res) {
  var accessToken=req.query.accessToken;
  console.log(accessToken);
  getImages(accessToken);
  res.end();
}

exports.query = function(req, res) {
  db.collections.users.find(
    {}, {imageurl: "https://scontent.cdninstagram.com/vp/ad06568281bf9a3a399e820815c7038a/5B1DA1B4/t51.2885-15/s640x640/sh0.08/e35/16110394_1048246915287037_7982772150744383488_n.jpg"
  ,emotions: {joy: "VERY_LIKELY"}
  }).toArray(function(err, result){
    if(err) throw err;
    console.log(result);
    res.end();
  });
  
}