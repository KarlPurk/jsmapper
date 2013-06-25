/**
 * Namespace/Facade for JsMapper.
 *
 * @class JsMapper
 */
var JsMapper = {
    Mapper: {},
    Transport: {},
    Util: {}
};
/**
 * Mapper Transport module
 * @type {MapperTransport}
 * @author Karl Purkhardt
 */
JsMapper.Transport.Default = (function() {
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

    return MapperTransport;

})();
JsMapper.Transport.JQuery = (function() {
    "use strict";

    var DefaultTransport = JsMapper.Transport.Default;

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

    return JQueryMapperTransport;

})();
JsMapper.Transport.XmlHttpRequest = (function() {
    "use strict";

    var DefaultTransport = JsMapper.Transport.Default;

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
        var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

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
            for (var key in options.headers) {

                // Don't attempt to utilise any properties from the prototype chain
                if (!options.headers.hasOwnProperty(key)) {
                    continue;
                }

                // Set the header for this request
                client.setRequestHeader(key, options.headers[key]);
            }
        }

        // Send the request
        client.send();
    };

    return XmlHttpRequestMapperTransport;

})();
JsMapper.Util.PromiseArray = (function() {
    "use strict";

    /**
     * Promise Array constructor.
     * @constructor
     */
    var PromiseArray = function() {
        this.isLoaded = false;
    };

    /**
     * Extend the array prototype
     */
    PromiseArray.prototype = Object.create(Array.prototype);

    return PromiseArray;

})();
/**
 * Mapper module.
 * @type {Mapper}
 * @author Karl Purkhardt
 */
JsMapper.Mapper.Default = (function() {
    'use strict';

    /**
     * Mapper constructor
     * @constructor
     */
	var Mapper = function() {};

    /**
     * Map a model to a single object
     * @param object
     * @param model
     * @returns Object
     */
	Mapper.prototype.load = function(object, model) {
		model = model || this.createModel();
		model = this.mapProperties(object, model);
		return model;
	};

    /**
     * Map the properties of one object (item) to another object (model)
     * @param object The object to map a model to
     * @param model The model to map
     * @returns Object
     */
	Mapper.prototype.mapProperties = function(object, model) {
        for (var key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }
            model[key] = object[key];
        }
        return model;
	};

    /**
     * Factory method for creating a new collection
     * @returns {Array}
     */
	Mapper.prototype.createCollection = function() {
		return [];
	};

    /**
     * Factory method for creating a new model.
     * This needs to be overloaded in object instances.
     */
	Mapper.prototype.createModel = function() {
		throw {
            type: 'MapperException',
			message: 'You must provide a model by overloading createModel'
		};
	};

    /**
     * Map many objects to a single model.
     * @param objects The objects to map models to
     * @param collection The optional collection to push models into
     * @returns Array Collection of models
     */
	Mapper.prototype.loadMany = function(objects, collection) {
		var self = this;
		collection = collection || this.createCollection();
		objects.forEach(function(item) {
			collection.push(self.load(item));
		});
		return collection;
	};

    return Mapper;
})();
/**
 * Promise Mapper module
 * @type {PromiseMapper}
 * @author Karl Purkhardt
 */
JsMapper.Mapper.Promise = (function() {
    "use strict";

    var Mapper = JsMapper.Mapper.Default;
    var PromiseArray = JsMapper.Util.PromiseArray;

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

    return PromiseMapper;

})();