'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger');

// eslint-disable-next-line require-jsdoc
function callExchangeRateService() {
    var exchangeRateService = LocalServiceRegistry.createService(
        'ExchangeRateService',
        {
            createRequest: function (svc) {
                svc.setRequestMethod('GET');
                var url = 'https://api.exchangeratesapi.io/v1/latest?access_key=a78c05234668d559bd0c8994777dd623';
                svc.setURL(url);
            },

            parseResponse: function (svc, response) {
                try {
                    var parsedResponse = JSON.parse(response.text);
                    return parsedResponse.rates;
                } catch (e) {
                    Logger.error('Error parsing response: ' + e);
                    return null;
                }
            },

            handleError: function (svc, error) {
                Logger.error('Error during service call: ' + error);
                return null;
            }
        }
    );
    var result = exchangeRateService.call();

    if (result.status === 'OK') {
        Logger.info('Exchange rates fetched successfully.');
        return result.object;
    }
    Logger.error('Error fetching exchange rates: ' + result.errorMessage);
    return null;
}

module.exports.callExchangeRateService = callExchangeRateService;