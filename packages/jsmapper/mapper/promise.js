var JsMapper = {Mapper: {}};
/**
 * Promise Mapper module
 * @type {PromiseMapper}
 * @author Karl Purkhardt
 */
JsMapper.Mapper.Promise = (function() {
    "use strict";

    var Mapper = require('./../loader').load('/mapper/default');
    var PromiseArray = require('./../loader').load('/util/promise-array');

    /**
     * Promise Mapper constructor
     * @constructor
     */
    var PromiseMapper = function() {};

    /**
     * Extend the default Mapper
     */
    PromiseMapper.prototype = Object.create(Mapper.prototype);

    /**
     * This method ensures that we always use the correct
     * model class with promise models.
     * @returns {*}
     */
    PromiseMapper.prototype.createPromiseModel = function() {
        var model = this.createModel();
        model.isLoaded = false;
        return model;
    };

    /**
     * Set the transport object to use for mapper requests.
     * @param transport
     */
    PromiseMapper.prototype.setTransport = function(transport) {
        this.transport = transport;
    };

    /**
     * Returns the current transport object
     * @returns {*}
     */
    PromiseMapper.prototype.getTransport = function() {
        if (!this.transport) {
            this.transport = MapperTransport.createXmlHttpRequestTransport();
        }
        return this.transport;
    };

    /**
     * Perform a request and map the result to models
     * @param options The mapper transport request options
     * @param loadMethod The load method callback to use to map the result to models
     * @param promise The promise that we will fulfill with this request
     * @returns {*}
     */
    PromiseMapper.prototype.fetchRequest = function(options, loadMethod, promise) {
        var self = this;
        var onSuccess = options.onSuccess;
        var onFailure = options.onFailure;

        /**
         * Callback for a successful request
         * @param response
         */
        options.onSuccess = function(response) {
            // TODO: abstract this - we can't assume this is JSON!
            var objects = JSON.parse(response);

            // Resolve the promise
            promise.isLoaded = true;

            // Map the model to the objects returned from the request
            loadMethod.call(self, objects, promise);

            // Call the success callback if one exists
            if (typeof onSuccess === 'function') {
                onSuccess(objects);
            }
        };

        /**
         * Callback for a failed request
         * @param response
         */
        options.onFailure = function(response) {

            // Resolve the promise
            promise.isLoaded = true;

            // Call the failure callback if one exists
            if (typeof onFailure === 'function') {
                onFailure(response);
            }
        };

        // Perform the request using the mapper transport object
        this.getTransport().request(options);
        return promise;
    };

    /**
     * Fetch a single object and map it to a model
     * @param options The mapper transport request options
     * @returns Object
     */
    PromiseMapper.prototype.fetch = function(options) {
        return this.fetchRequest(options, this.load, this.createPromiseModel());
    };

    /**
     * Fetch an array of objects and map them to a specified model
     * @param options The mapper transport request options
     * @returns PromiseArray
     */
    PromiseMapper.prototype.fetchMany = function(options) {
        return this.fetchRequest(options, this.loadMany, new PromiseArray());
    };

    module.exports = PromiseMapper;

})();