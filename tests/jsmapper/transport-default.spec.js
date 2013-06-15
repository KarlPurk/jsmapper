describe("Default Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/loader').load('/transport/default');

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