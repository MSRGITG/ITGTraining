'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
server.extend(module.superModule);

server.get('Page1', function (req, res, next) {
    res.render('home/page1');
    next();
});

server.post('AddNumber', function (req, res, next) {
    var num = parseInt(req.form.number, 10);
    var final = num+ 1;
    res.redirect(URLUtils.url('Home-Page2', 'final', final));
    next();
});

server.get('Page2', function (req, res, next) {
    var final = req.querystring.final;
    res.render('home/page2', { final: final });
    next();
});
module.exports = server.exports();
