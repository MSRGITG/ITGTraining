'use strict';

var server = require('server');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

server.get('Page1',consentTracking.consent, cache.applyDefaultCache, function (req, res, next) {
    res.render('home/page1');
    next();
});

module.exports = server.exports();
