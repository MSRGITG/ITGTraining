'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');

server.get('Show', server.middleware.https, function (req, res, next) {
    var actionUrl = URLUtils.url('NewsLetter-Handler');
    var newsletterForm = server.forms.getForm('newsletter');
    newsletterForm.clear();
    res.render('home/newslettersignup', {
        actionUrl: actionUrl,
        newsletterForm: newsletterForm
    });

    next();
});

// eslint-disable-next-line consistent-return
server.post('Handler', server.middleware.https, function (req, res, next) {
    var newsletterForm = server.forms.getForm('newsletter');
    var Resource = require('dw/web/Resource');

    if (!newsletterForm.valid) {
        res.setStatusCode(400);
        res.json({
            error: true,
            message: 'Form is invalid. Please check your input.',
            continueUrl: URLUtils.url('Error-Start').toString()
        });
        return next();
    }

    if (newsletterForm.email.value !== newsletterForm.emailConfirmation.value) {
        res.setStatusCode(500);
        res.json({
            success: false,
            error: [
                Resource.msg('error.crossfieldvalidation', 'newsletter', null)
            ]
        });
        return next();
    }

    var Transaction = require('dw/system/Transaction');
    try {
        Transaction.wrap(function () {
            var CustomObjectMgr = require('dw/object/CustomObjectMgr');
            var co;
            try {
                co = CustomObjectMgr.createCustomObject(
                    'NewsletterSubscription',
                    newsletterForm.email.value
                );
                co.custom.firstName = newsletterForm.fname.value;
                co.custom.lastName = newsletterForm.lname.value;
                // eslint-disable-next-line no-undef
                dw.system.HookMgr.callHook(
                    'newsletter.email',
                    'send',
                    newsletterForm.email.value
                );
            } catch (e) {
                var Logger = require('dw/system/Logger');
                Logger.error(
                    'Custom object "NewsletterSubscription" could not be created: ' +
                        e.message
                );
                res.setStatusCode(500);
                res.json({
                    error: true,
                    message:
                        'Custom object "NewsletterSubscription" could not be created.',
                    continueUrl: URLUtils.url('Error-Start').toString()
                });
            }
        });
        res.json({
            success: true,
            continueUrl: URLUtils.url('NewsLetter-Success').toString(),
            newsletterForm: server.forms.getForm('newsletter')
        });
    } catch (e) {
        var Logger = require('dw/system/Logger');

        if (e.javaName === 'MetaDataException') {
            res.setStatusCode(400);
            res.json({
                success: false,
                error: [
                    Resource.msg('error.subscriptionexists', 'newsletter', null)
                ]
            });
        } else {
            Logger.error('An unexpected error occurred: ' + e.message);
            res.setStatusCode(500);
            res.json({
                error: true,
                redirectUrl: URLUtils.url('Error-Start').toString()
            });
        }
    }

    next();
});

server.get('Success', server.middleware.https, function (req, res, next) {
    res.render('home/newslettersuccess', {
        continueUrl: URLUtils.url('NewsLetter-Show'),
        newsletterForm: server.forms.getForm('newsletter')
    });

    next();
});

module.exports = server.exports();
