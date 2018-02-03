var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  userid: String,
  joyLikelihood: String,  
  sorrowLikelihood: String,
  angerLikelihood: String,
  surpriseLikelihood: String        
});

mongoose.model('User', UserSchema);