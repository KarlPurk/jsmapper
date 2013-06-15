describe("Promise Mapper", function () {

    var PromiseMapper = require('./../../packages/jsmapper/main.js').Mapper.Promise;

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