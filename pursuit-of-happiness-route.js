module.exports = function(app){
    var poh = require('./pursuit-of-happiness-controller');
    app.get('/getData', poh.query);
    //app.get('/musicians/:id', musicians.findById);
    app.post('/test', poh.add);
    app.put('/test/:id', poh.update);
    app.delete('/test/:id', poh.delete);

    app.get('/import', poh.import);
}