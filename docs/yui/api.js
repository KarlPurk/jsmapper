YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Loader"
    ],
    "modules": [
        "Loader"
    ],
    "allModules": [
        {
            "displayName": "Loader",
            "name": "Loader",
            "description": "This module basically allows me to keep the require paths relative to the jsmapper directory.\nWe want to do this so that we can automatically convert those into variables when we build\nthe project for the browser.\n\nE.g:\n - require('./../../loader').load('/path/to/file')\n\ninstead of:\n - require('./file')\n\nThis allows us to convert:\n - require('./../../loader').load('/path/to/file')\n\ninto:\n - JsMapper.Path.To.File\n\nwhich makes it easy to automatically build the project for use in the browser."
        }
    ]
} };
});