var JsMapper = {Util: {}};
JsMapper.Util.PromiseArray = (function() {
    "use strict";

    /**
     * Promise Array constructor.
     * @constructor
     */
    var PromiseArray = function() {
        this.isLoaded = false;
    };

    /**
     * Extend the array prototype
     */
    PromiseArray.prototype = Object.create(Array.prototype);

    module.exports = PromiseArray;

})();