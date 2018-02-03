module.exports = function(app) {
    var todoList = require('../controllers/apiEndpoints');
  
    // todoList Routes
    app.route('/vision')
      .get(todoList.googleVision);

    
};