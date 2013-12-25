var restify = require('restify');
var MiniOps = require('../index');

function respond(req, res, next) {
    res.send('hello ' + req.params.name);
    next();
}

function respondError(req, res, next) {
    next('that did not work with ' + req.params.name);
}

var miniOps = new MiniOps();

var server = restify.createServer();
server.use(restify.jsonp());

server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get('/error/:name', respondError);

server.get('/ops', miniOps.dataHub());

server.on('after', miniOps.recorder());

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});