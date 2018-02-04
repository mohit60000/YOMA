var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var UserSchema = new Schema({
  url: String,
  emotions: {String} 
});

mongoose.model('User', UserSchema);