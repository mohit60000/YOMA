module.exports = function(app){
    var poh = require('./pursuit-of-happiness-controller');
    app.get('/test', poh.findAll);
    //app.get('/musicians/:id', musicians.findById);
    app.post('/test', poh.add);
    app.put('/test/:id', poh.update);
    app.delete('/test/:id', poh.delete);
}