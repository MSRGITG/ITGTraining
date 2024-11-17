'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var CSVStreamWriter = require('dw/io/CSVStreamWriter');
var Transaction = require('dw/system/Transaction');

// eslint-disable-next-line require-jsdoc
function execute() {
    var query = 'custom.orderReported = false';
    var orders = OrderMgr.searchOrders(query, 'creationDate desc');

    if (!orders.hasNext()) {
        return;
    }

    var dateTime = new Date()
        .toISOString()
        .replace(/[-:.T]/g, '')
        .slice(0, 14);
    var fileName = 'OrderShipmentReport-' + dateTime + '.csv';
    var filePath = File.IMPEX + '/src/orders/ShipmentReports/' + fileName;

    var file = new File(filePath);
    var fileWriter = new FileWriter(file);
    var csvWriter = new CSVStreamWriter(fileWriter);

    csvWriter.writeNext([
        'Order ID/No',
        'Shipping Status',
        'Export Status',
        'Customer Email',
        'Order Status'
    ]);

    while (orders.hasNext()) {
        var order = orders.next();
        csvWriter.writeNext([
            order.orderNo,
            order.shippingStatus,
            order.exportStatus,
            order.customerEmail,
            order.status
        ]);

        // eslint-disable-next-line no-loop-func
        Transaction.wrap(function () {
            order.custom.orderReported = true;
        });
    }
    csvWriter.close();
}
module.exports = {
    execute: execute
};
