var JsMapper = {Transport: {}};
JsMapper.Transport.XmlHttpRequest = (function() {
    "use strict";

    var DefaultTransport = require('./../loader').load('/transport/default');

    /**
     * XmlHttpRequestMapperTransport
     * @constructor
     */
    var XmlHttpRequestMapperTransport = function() {};

    /**
     * Extend the default mapper transport object.
     */
    XmlHttpRequestMapperTransport.prototype = Object.create(DefaultTransport.prototype);

    XmlHttpRequestMapperTransport.prototype.createXmlHttpRequest = function() {

        // Require the XMLHttpRequest module
        var XMLHttpRequest = require('w3c-xmlhttprequest').XMLHttpRequest;

        // Create a new xml http request object
        return new XMLHttpRequest();
    };

    /**
     * Perform the request using XMLHttpRequest.
     * @param options
     */
    XmlHttpRequestMapperTransport.prototype.doRequest = function(options) {

        var client = this.createXmlHttpRequest();

        // Open the connection
        client.open(options.type || 'GET', options.url);

        // Callback for state change
        client.onreadystatechange = function() {

            // If the request is complete
            if (this.readyState === this.DONE) {

                // If the request succeeded
                if (this.status === 200) {

                    // Call the success callback method if one exists
                    if (typeof options.onSuccess === 'function') {
                        options.onSuccess(this.response);
                    }
                }
                else {

                    // Call the failure callback method if one exists
                    if (typeof options.onFailure === 'function') {
                        options.onFailure(this.responseText);
                    }
                }
            }
        };

        // Set the response type for this request
        if (options.responseType) {
            client.responseType = options.responseType;
        }

        // Set request headers
        if (options.headers) {
            Object.keys(options.headers).forEach(function(key) {

                // Don't attempt to utilise any properties from the prototype chain
                if (!options.headers.hasOwnProperty(key)) {
                    return;
                }

                // Set the header for this request
                client.setRequestHeader(key, options.headers[key]);
            });
        }

        // Send the request
        client.send();
    };

    module.exports = XmlHttpRequestMapperTransport;

})();