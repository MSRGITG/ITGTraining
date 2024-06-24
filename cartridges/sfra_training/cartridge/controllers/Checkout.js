'use strict';

var server = require('server');
var BasketMgr = require('dw/order/BasketMgr');
var URLUtils = require('dw/web/URLUtils');

server.extend(module.superModule);

server.append('Begin', function (req, res, next) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var productLineItems = currentBasket.productLineItems.iterator();
    var hasInvalidQuantity = false;

    while (productLineItems.hasNext()) {
        var productLineItem = productLineItems.next();
        if (productLineItem.quantity.value < 10) {
            hasInvalidQuantity = true;
            break;
        }
    }

    if (hasInvalidQuantity) {
        res.redirect(URLUtils.url('Cart-Show', 'showErorr', 'true'));
    }

    next();
});

module.exports = server.exports();






