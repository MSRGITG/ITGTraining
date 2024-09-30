'use strict';

var server = require('server');
const OrderMgr = require('dw/order/OrderMgr');
const Transaction = require('dw/system/Transaction');
server.post('IncrementOrderingNo', function (req, res, next) {
    const orderId = req.form.orderId;
    const order = OrderMgr.getOrder(orderId);
    // i want to check if there is an order or not
    if (order) {
        Transaction.wrap(function () {
            let orderingNo = order.custom.OrderingNo || 0;
            order.custom.OrderingNo = orderingNo + 1;
        });
        const orderStatus = order.status.displayValue;
        const orderTotalPrice = order.totalGrossPrice.value;
        res.render('home/page2', {
            resultnumber: order.custom.OrderingNo,
            orderStatus: orderStatus,
            orderTotalPrice: orderTotalPrice
        });
    } else {
        res.render('error', {
            message: 'Order Not Found! , please try again if you want.'
        });
    }
    next();
});
module.exports = server.exports();
