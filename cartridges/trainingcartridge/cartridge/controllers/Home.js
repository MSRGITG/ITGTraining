'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.get(
    'Page1',
    consentTracking.consent,
    cache.applyDefaultCache,
    function (req, res, next) {
        res.render('home/page1');
        next();
    }
);

server.post('AddNumber', function (req, res, next) {
    var enteredNumber = parseInt(req.form.number, 10);
    var incrementalNumber = enteredNumber + 1;
    res.render('home/page2', { resultnumber: incrementalNumber });
    next();
});

module.exports = server.exports();
