describe("Mapper", function () {

    var Mapper = JsMapper.Mapper.Default;

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
describe("Promise Mapper", function () {

    var PromiseMapper = JsMapper.Mapper.Promise;

    var promiseMapper = new PromiseMapper();

    promiseMapper.createModel = function() {
		return {};
	};

    var createFakeTransport = function(timeout, response) {
        response = response || '[{"name": "Karl"},{"name":"John"},{"name":"Bob"}]';
        return {
            request: function(options) {
                if (timeout === 0) {
                    options.onSuccess(response);
                }
                else {
                    setTimeout(function() {
                        options.onSuccess(response);
                    }, timeout);
                }
            }
        };
    };

    it("Should return a promise object", function () {
        promiseMapper.setTransport(createFakeTransport(1, '{"name": "Karl"}'));
        var model = promiseMapper.fetch({url: '/anywhere'});
        expect(model.isLoaded).toEqual(false);
    });

    it("Should return a promise collection", function () {
        promiseMapper.setTransport(createFakeTransport(1));
        var collection = promiseMapper.fetchMany({url: '/anywhere'});
        expect(collection.length).toEqual(0);
        expect(collection.isLoaded).toEqual(false);
    });

    it("Should fulfill a promise object", function (done) {
        promiseMapper.setTransport(createFakeTransport(0, '{"name": "Karl"}'));
        var model = promiseMapper.fetch({url: '/anywhere'});
        setTimeout(function() {
            expect(model.isLoaded).toEqual(true);
            expect(model.name).toEqual('Karl');
            done();
        },500);
    });

    it("Should fulfill a promise collection", function (done) {
        promiseMapper.setTransport(createFakeTransport(0));
        var collection = promiseMapper.fetchMany({url: '/anywhere'});
        setTimeout(function() {
            expect(collection.isLoaded).toEqual(true);
            expect(collection.length).toEqual(3);
            done();
        },500);
    });
});
describe("Default Mapper Transport", function () {

    var Transport = JsMapper.Transport.Default;

    it("doRequest should throw an exception if it is not overloaded", function () {
        var transport = new Transport();
        expect(function() { transport.doRequest({}); }).toThrow();
    });

	it("validateOptions should throw an exception if a URL is not included in the config object", function () {
        var transport = new Transport();
        expect(function() { transport.validateOptions({}); }).toThrow();
	});

	it("request should call validateOptions and doRequest", function () {
        var transport = new Transport();
        var config = {url: '/anything'};

        spyOn(transport, 'validateOptions');
        spyOn(transport, 'doRequest');
        spyOn(transport, 'request').andCallThrough();

        transport.request(config);

        expect(transport.validateOptions).toHaveBeenCalledWith(config);
        expect(transport.doRequest).toHaveBeenCalledWith(config);
        expect(transport.request).toHaveBeenCalledWith(config);
    });

});
jQuery = {ajax: function() {}};

describe("jQuery Mapper Transport", function () {

    var Transport = JsMapper.Transport.JQuery;

    it("doRequest should call jQuery.ajax", function () {
        var config = {url: '/anything'};
        var transport = new Transport();

        spyOn(jQuery, 'ajax');
        spyOn(transport, 'doRequest').andCallThrough();

        transport.doRequest(config);

        expect(jQuery.ajax).toHaveBeenCalledWith(config);
    });
});
describe("XML HTTP Request Mapper Transport", function () {

    var Transport = JsMapper.Transport.XmlHttpRequest;

    it("doRequest should call XMLHttpRequest open and send methods", function () {
        var config = {url: '/anything'};
        var transport = new Transport();

        var fakeXmlHttpRequest = {
            open: function() {},
            onreadystatechange: function() {},
            send: function() {}
        };

        spyOn(transport, 'createXmlHttpRequest').andReturn(fakeXmlHttpRequest);
        spyOn(fakeXmlHttpRequest, 'open');
        spyOn(fakeXmlHttpRequest, 'send');

        transport.doRequest(config);

        expect(transport.createXmlHttpRequest).toHaveBeenCalled();
        expect(fakeXmlHttpRequest.open).toHaveBeenCalled();
        expect(fakeXmlHttpRequest.send).toHaveBeenCalled();
    });
});