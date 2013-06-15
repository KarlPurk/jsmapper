# JS Mapper #

JS Mapper is an implementation of the mapper pattern written in JavaScript.  It works on both node.js and in the browser.

## Promise Mapper ##

JS Mapper also features a "promise" mapper.  Which is essentially an asynchronous mapper that works in a synchronous way.  For example, when you call fetchAll() you will be given an array back immediately.  When the data is returned from the server a property on the array (isLoaded) will be set to true which you can then respond to.

## Node Installation ##
Not currently available as an npm.  Please clone repo and type `npm install`.

## Browser Installation ##
Download `dist/jsmapper.js` or `dist/jsmapper.min.js`.

## Quick (Basic)  Example ##

<code>
Person = function() { this.name = 'Unknown'; };
Person.prototype.getName = function() { return this.name; };

personMapper = new JsMapper.Mapper.Default();
personMapper.createModel = function(item) { return new Person(); };
model = personMapper.load({name: 'Karl Purkhardt'});

console.log(model.getName()) // Outputs "Karl Purkhardt"
</code>

## More Examples ##
Please see the examples folder for more examples.