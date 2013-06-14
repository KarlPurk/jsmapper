var PromiseMapper = require('./../../packages/jsmapper/promise-mapper.js');

// Create a very basic person model
var Person = function() { this.name = 'Unknown'; };

// Give the person model a getName method
Person.prototype.getName = function() { return this.name; };

// Create a new person mapper
var personMapper = new PromiseMapper();

// Overload the load method to provide logic for mapping to a person model
personMapper.createModel = function(item) {
	return new Person();
};

// Create a fake transport object that returns a JSON string
personMapper.setTransport({
    request: function(options) {
        setTimeout(function() {
            options.onSuccess('[{"name": "Karl"},{"name":"John"},{"name":"Bob"}]');
        }, 1500);
    }
});

// Fetch many person models from a backend data store
var collection = personMapper.fetchMany({url: 'http://some/url'});

// Keep checking the collection until some models are returned by the promise
var interval = setInterval(function() {

	// The promise has an isLoaded method to check if the request has finished
	// Keep outputting a not loaded message while we wait for the promise to be filled
	if (!collection.isLoaded) {
		console.log('Not loaded yet');
		return;
	}

	clearInterval(interval);
	
	// Loop through the models returned from the promise
	collection.forEach(function(model) {
	
		// Output the result of the getName method call for each mapped model
		console.log(model.getName());
	});
}, 1000);