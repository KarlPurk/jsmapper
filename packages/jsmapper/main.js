(function(){
    module.exports = {
        Mapper: require('./mapper.js'),
        PromiseArray: require('./promise-array.js'),
        PromiseMapper: require('./promise-mapper.js'),
        Transport: {
            Default: require('./transport-default.js'),
            JQuery: require('./transport-jquery.js'),
            XmlHttpRequest: require('./transport-xml-http-request.js')
        }
    };
})();