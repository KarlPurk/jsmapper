describe("Mapper", function () {

    var Mapper = require('./../../packages/jsmapper/loader').load('/mapper/default');

    var mapper = new Mapper();
	
	mapper.createModel = function() {
		return {isModel: true};
	};

	it("Should be able to map proprties from one object to another", function () {
		var object = mapper.mapProperties({firstName: 'Karl'}, {lastName: 'Purkhardt'});
        expect(object.firstName).toBe('Karl');
        expect(object.lastName).toBe('Purkhardt');
	});

	it("Should be able to map a single object to a model", function () {
		expect(mapper.load({}).isModel).toBe(true);
	});
	
	it("Should be able to map an array of objects to a model", function () {
		var models = mapper.loadMany([{}, {}]);
		expect(models[0].isModel).toBe(true);
		expect(models[1].isModel).toBe(true);
	});

    it("Should throw an exception if the createModel method is not overloaded", function() {
        var exceptionMapper = new Mapper();
        expect(function() { exceptionMapper.createModel(); }).toThrow();
    });

    it("createCollection method return an array by default", function() {
        expect(mapper.createCollection()).toEqual([]);
        expect(mapper.createCollection().length).toBe(0);
    });
});