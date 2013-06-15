(function() {

    module.exports = {
        Mapper: {
            Default: require('./mapper/default.js'),
            Promise: require('./mapper/promise.js')
        },
        Transport: {
            Default: require('./transport/default.js'),
            JQuery: require('./transport/jquery.js'),
            XmlHttpRequest: require('./transport/xml-http-request.js')
        },
        Util: {
            PromiseArray: require('./util/promise-array.js')
        }
    };
})();