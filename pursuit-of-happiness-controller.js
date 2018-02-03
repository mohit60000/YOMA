var mongoose = require('mongoose'),
User = mongoose.model('User');

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
    { "userid": "1", 
    "photos": 
    {
        "photoid": "1", 
        "hashtags": 
          {
            "joyLikelihood": "VERY_LIKELY",
            "sorrowLikelihood": "VERY_UNLIKELY",
            "angerLikelihood": "VERY_UNLIKELY",
            "surpriseLikelihood": "VERY_UNLIKELY"
          } 
    }
  },
    function (err) {
    if (err) return console.log(err);
    return res.send(202);
  });
};

exports.findById = function() {};
exports.add = function() {};
exports.update = function() {};
exports.delete = function() {};