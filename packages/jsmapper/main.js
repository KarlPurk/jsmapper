(function() {

    module.exports = {
        Mapper: {
            Default: require('./mapper.js'),
            Promise: require('./promise-mapper.js')
        },
        Transport: {
            Default: require('./transport-default.js'),
            JQuery: require('./transport-jquery.js'),
            XmlHttpRequest: require('./transport-xml-http-request.js')
        },
        Util: {
            PromiseArray: require('./promise-array.js')
        }
    };
})();