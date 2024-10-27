'use strict';

var base = require('../../../../../app_storefront_base/cartridge/client/default/js/product/base');

/**
 * Updates the availability of a product based on the response.
 *
 * @param {Event} e - The event object.
 * @param {Object} response - The response object containing product information.
 * @param {Object} response.product - The product data.
 * @param {boolean} response.product.readyToOrder - Indicates if the product is ready to order.
 * @param {Array} response.product.ats.messages - An array of availability messages.
 * @param {jQuery} response.$productContainer - The jQuery object representing the product container.
 * @param {Object} response.resources - The resources for the response.
 * @param {string} response.resources.info_selectforstock - The message for stock selection.
 */
function updateAvailability(e, response) {
    var availabilityValue = '';
    var availabilityMessages = response.product.availability.messages;
    if (!response.product.readyToOrder) {
        availabilityValue =
            '<li><div>' +
            response.resources.info_selectforstock +
            '</div></li>';
    } else {
        availabilityMessages.forEach(function (message) {
            availabilityValue += '<li><div>' + message + '</div></li>';
        });
    }

    $('div.availability', response.$productContainer)
        .data('ready-to-order', response.product.readyToOrder)
        .data('available', response.product.available);

    $('.availability-msg', response.$productContainer)
        .empty()
        .html(availabilityValue);

    if ($('.global-availability').length) {
        var allAvailable = $('.product-availability')
            .toArray()
            .every(function (item) {
                return $(item).data('available');
            });

        var allReady = $('.product-availability')
            .toArray()
            .every(function (item) {
                return $(item).data('ready-to-order');
            });

        $('.global-availability')
            .data('ready-to-order', allReady)
            .data('available', allAvailable);

        $('.global-availability .availability-msg')
            .empty()
            .html(
                allReady
                    ? response.message
                    : response.resources.info_selectforstock
            );
    }
}

$(document).ready(function () {
    $('body')
        .off('product:updateAvailability')
        .on('product:updateAvailability', updateAvailability);
    base.updateAvailability = updateAvailability;
    module.exports = base;
});
