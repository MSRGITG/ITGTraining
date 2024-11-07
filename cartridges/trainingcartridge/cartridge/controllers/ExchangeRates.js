'use strict';

var server = require('server');
var ExchangeRatesService = require('../scripts/services/ExchangeRateServices');

server.get('Show', function (req, res, next) {
    try {
        var rates = ExchangeRatesService.callExchangeRateService();
        if (rates) {
            res.render('home/ExchangeRates', {
                rates: rates
            });
        } else {
            res.render('error', {
                message: 'Unable to fetch exchange rates at the moment.'
            });
        }
    } catch (error) {
        res.render('error', { message: error });
    }

    next();
});

module.exports = server.exports();
