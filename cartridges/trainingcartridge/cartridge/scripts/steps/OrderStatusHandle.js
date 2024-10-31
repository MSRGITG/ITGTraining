'use strict';

const OrderMgr = require('dw/order/OrderMgr');
const Logger = require('dw/system/Logger');
const Transaction = require('dw/system/Transaction');

const jobLogger = Logger.getLogger('CheckOrderStatuses');

// eslint-disable-next-line require-jsdoc
function execute() {
    const orders = OrderMgr.queryOrders(
        'shippingStatus = {0} AND exportStatus = {1}',
        'creationDate desc',
        // eslint-disable-next-line no-undef
        dw.order.Order.SHIPPING_STATUS_SHIPPED,
        // eslint-disable-next-line no-undef
        dw.order.Order.EXPORT_STATUS_EXPORTED
    );

    let order;
    while (orders.hasNext()) {
        order = orders.next();

        // eslint-disable-next-line no-loop-func
        Transaction.wrap(function () {
            order.custom.OrderShippedExported = true;
        });

        jobLogger.info(
            'Order Number: {0} has been set to OrderShippedExported = true',
            order.orderNo
        );
    }

    orders.close();

    return 0;
}

module.exports = {
    execute: execute
};
