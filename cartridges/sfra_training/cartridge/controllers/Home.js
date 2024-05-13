'use strict';

var server = require('server');
server.extend(module.superModule);

server.get('Page1', function (req, res, next) {
    res.render('home/page1');
    next();
});

module.exports = server.exports();