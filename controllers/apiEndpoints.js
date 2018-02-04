const request = require("request");
const async = require("async");
const wait=require('wait.for');
global.emotions={};

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
      sendData();
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
  }

function sendData(){
  joy=global.emotions['joy'];
  anger=global.emotions['anger'];
  sorrow=global.emotions['sorrow'];
  surprise=global.emotions['surprise'];
  // Set the headers
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  }
  var options = {
    url: 'http://10.107.93.45:4000/test',
    method: 'POST',
    headers: headers,
    form: {'name': 'mohit'}
  }
  JSON.stringify(global.emotions);
  console.log(global.emotions);
  if(joy.length>0 && anger.length>0 && sorrow.length>0 && surprise.length>0){
    console.log('hello');
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          console.log(body)
      }
  })
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