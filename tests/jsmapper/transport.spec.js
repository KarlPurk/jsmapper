jQuery = {ajax: function() {}};

describe("Default Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/transport.js');

    it("doRequest should throw an exception if it is not overloaded", function () {
        var transport = new Transport.Default();
        expect(function() { transport.doRequest({}); }).toThrow();
    });

	it("validateOptions should throw an exception if a URL is not included in the config object", function () {
        var transport = new Transport.Default();
        expect(function() { transport.validateOptions({}); }).toThrow();
	});

	it("request should call validateOptions and doRequest", function () {
        var transport = new Transport.Default();
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

describe("jQuery Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/transport.js');

    it("doRequest should call jQuery.ajax", function () {
        var config = {url: '/anything'};
        var transport = new Transport.JQuery();

        spyOn(jQuery, 'ajax');
        spyOn(transport, 'doRequest').andCallThrough();

        transport.doRequest(config);

        expect(jQuery.ajax).toHaveBeenCalledWith(config);
    });
});

describe("XML HTTP Request Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/transport.js');

    it("doRequest should call XMLHttpRequest open and send methods", function () {
        var config = {url: '/anything'};
        var transport = new Transport.XmlHttp();

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