var JsMapper = {Transport: {}};
JsMapper.Transport.JQuery = (function() {
    "use strict";

    var DefaultTransport = require('./../loader').load('/transport/default');

    /**
     * JQueryMapperTransport constructor
     * @constructor
     */
    var JQueryMapperTransport = function() {};

    /**
     * Extend the default mapper transport object.
     */
    JQueryMapperTransport.prototype = Object.create(DefaultTransport.prototype);

    /**
     * Perform the request using jQuery.ajax and pass the options directly to this method.
     * @param options
     */
    JQueryMapperTransport.prototype.doRequest = function(options) {
        jQuery.ajax(options);
    };

    module.exports = JQueryMapperTransport;

})();