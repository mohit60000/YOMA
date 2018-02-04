var mongoose = require('mongoose'),
User = mongoose.model('User');
fs = require('fs');

var mongoUri = 'mongodb://omi23.vaidya:Omkar23..@ds217898.mlab.com:17898/pofh';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});


// exports.findAll = function(req, res){
//     res.send([{
//       "userid": 1,
//       "photos": [
//         "./some/photo/link","
//       ],
//       "hashtags": [
//         "#uf",
//         "#gogators"
//       ]
//     }]);
//   };

exports.findAll = function(req, res){
  User.find({},function(err, results) {
    return res.send(results);
  });
};

 exports.import = function(req, res){
  User.create(
    { "userid": "2", 
    "joyLikelihood": "high",  
    "sorrowLikelihood": "med",
    "angerLikelihood": "med",
    "surpriseLikelihood": "no"  
  },
    function (err) {
    if (err) return console.log(err);
    return res.sendStatus(202);
  });
 };


//  exports.import = function(req, res){
//   User.create(
//     { "userid": "2", 
//     "photos": 
//     {
//         "photoid": "2", 
//         "hashtags": 
//           {
//             "joyLikelihood": "VERY_UNLIKELY",
//             "sorrowLikelihood": "VERY_LIKELY",
//             "angerLikelihood": "VERY_UNLIKELY",
//             "surpriseLikelihood": "VERY_UNLIKELY"
//           } 
//     }
//   },
//     function (err) {
//     if (err) return console.log(err);
//     return res.sendStatus(202);
//   });
//  };




exports.findById = function() {};

exports.add = function(req, res) {
  console.log(db);
    db.collections.users.save(
      {user: req.query}
    );
    res.end();

  };

exports.query = function(req, res) {
  //db.collections.users.find({"userid":"1"});
  var query={userid:"1"};
  var imageUrlArr=[]
  db.collection("users").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    for(var i=0;i<result.length;i++)
    {
      var emotions=result[i].emotions;
      console.log(emotions);
      for(var j=0;j<emotions.JOY.length;j++)
      {
        var j=emotions.JOY[i];
        var s=emotions.SORROW[i];
        if(j=="VERY_LIKELY" || j=="LIKELY" || j=="POSSIBLE" || s=="VERY_LIKELY" || s=="LIKELY" || s=="POSSIBLE")
        {
          console.log(result[i].imageUrl);
          imageUrlArr.push(result[i].imageUrl);          
        }
      }
      console.log("1"+imageUrlArr);
    }
    //res.end();
    res.write(''+imageUrlArr);
    res.end();
    db.close();
  });
  //console.log("2"+imageUrlArr);
};

exports.update = function() {};
exports.delete = function() {};