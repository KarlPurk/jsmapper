describe("XML HTTP Request Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/main.js').Transport;

    it("doRequest should call XMLHttpRequest open and send methods", function () {
        var config = {url: '/anything'};
        var transport = new Transport.XmlHttpRequest();

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