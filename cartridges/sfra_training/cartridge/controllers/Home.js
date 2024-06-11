'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');

server.extend(module.superModule);

server.get('Page1', function (req, res, next) {
    res.render('home/page1');
    next();
});

server.post('Submit', function (req, res, next) {
    var orderid = req.form.orderid;
    var order= OrderMgr.getOrder(orderid);
    Transaction.wrap(function() {
        var orderingNo = order.custom.OrderingNo|| 0;
        order.custom.OrderingNo= orderingNo + 1;
    });
    res.redirect(URLUtils.url('Home-Page2', 'orderid', orderid));
    next();
});

server.get('Page2', function (req, res, next) {
    var orderid = req.querystring.orderid;
    var order= OrderMgr.getOrder(orderid);
    res.render('home/page2',{ order: order });
    next();
});
module.exports = server.exports();
