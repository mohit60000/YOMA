var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  userid: String,
  photos: [{
      "photoid": String,
      "hashtags": {
          "joyLikelihood": String,
          "sorrowLikelihood": String,
          "angerLikelihood": String,
          "surpriseLikelihood": String
        }
  }]  
});

mongoose.model('User', UserSchema);