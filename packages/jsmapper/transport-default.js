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

    module.exports = MapperTransport;

})();