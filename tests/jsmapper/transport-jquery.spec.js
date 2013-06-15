jQuery = {ajax: function() {}};

describe("jQuery Mapper Transport", function () {

    var Transport = require('./../../packages/jsmapper/loader').load('/transport/jquery');

    it("doRequest should call jQuery.ajax", function () {
        var config = {url: '/anything'};
        var transport = new Transport();

        spyOn(jQuery, 'ajax');
        spyOn(transport, 'doRequest').andCallThrough();

        transport.doRequest(config);

        expect(jQuery.ajax).toHaveBeenCalledWith(config);
    });
});