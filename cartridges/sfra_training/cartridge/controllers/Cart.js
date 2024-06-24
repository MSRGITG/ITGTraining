'use strict';

var server = require('server');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var showErorr = req.querystring.showErorr || null;

    var viewdata=res.getViewData();
    viewdata.showErorr=showErorr;
    res.setViewData(viewdata);

    next();
});

module.exports = server.exports();

