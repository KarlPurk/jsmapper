var JsMapper = {Mapper: {}};
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

    module.exports = Mapper;
})();