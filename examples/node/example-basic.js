var Mapper = require('./../../packages/jsmapper/main.js').Mapper.Default;

// Create a very basic person model
var Person = function() { this.name = 'Unknown'; };

// Give the person model a getName method
Person.prototype.getName = function() { return this.name; };

// Create a new person mapper
var personMapper = new Mapper();

// Overload the createModel and return a person model to wrap an object with
personMapper.createModel = function(item) {
	return new Person();
};

// Map two objects to person models and call the getName method on the person models
console.log(personMapper.load({name: 'Karl'}).getName());
console.log(personMapper.load({name: 'Bob'}).getName());

// Map a collection of objects to person models
personMapper.loadMany([{name: 'John'}, {name: 'Jack'}]).forEach(function(model) {
	// Output the result of the getName method call for each mapped model
	console.log(model.getName());
});