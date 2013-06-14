/**
 * Mapper Transport module
 * @type {MapperTransport}
 * @author Karl Purkhardt
 */
(function() {
    "use strict";

    /**
     * MapperTransport constructor
     * @constructor
     */
    var MapperTransport = function() {};

    /**
     * Transport objects generally accept a config/options object.
     * This method provides a convenient hook for validating the
     * config/options object to ensure it contains required attributes.
     * You should throw an exception if a required option is not set.
     * @param options The transport config/options object
     * @return void
     */
    MapperTransport.prototype.validateOptions = function(options) {
        if (!options.url) {
            throw {
                type: 'XmlHttpRequestMapperTransportException',
                message: 'You must provide a url'
            };
        }
    };

    /**
     * The public method for performing a request on the transport object.
     * This method will validate the options before performing the actual request.
     * @param options The transport config/options object
     */
    MapperTransport.prototype.request = function(options) {
        this.validateOptions(options);
        this.doRequest(options);
    };

    /**
     * Performs the request using the options passed in.
     * You should overload this method in objects that extend this base.
     * @param options
     */
    MapperTransport.prototype.doRequest = function(options) {
        throw {
            type: 'MapperTransportException',
            message: 'You must overload the request method'
        };
    };

    module.exports.Default = MapperTransport;

})();

(function() {
    "use strict";

    /**
     * XmlHttpRequestMapperTransport
     * @constructor
     */
    var XmlHttpRequestMapperTransport = function() {};

    /**
     * Extend the default mapper transport object.
     */
    XmlHttpRequestMapperTransport.prototype = Object.create(module.exports.Default.prototype);

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

    module.exports.XmlHttp = XmlHttpRequestMapperTransport;

})();

(function() {
    "use strict";

    /**
     * JQueryMapperTransport constructor
     * @constructor
     */
    var JQueryMapperTransport = function() {};

    /**
     * Extend the default mapper transport object.
     */
    JQueryMapperTransport.prototype = Object.create(module.exports.Default.prototype);

    /**
     * Perform the request using jQuery.ajax and pass the options directly to this method.
     * @param options
     */
    JQueryMapperTransport.prototype.doRequest = function(options) {
        jQuery.ajax(options);
    };

    module.exports.JQuery = JQueryMapperTransport;

})();