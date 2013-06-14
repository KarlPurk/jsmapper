module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jasmine_node: {
            specNameMatcher: ".*spec", // load only specs containing specNameMatcher
            projectRoot: "tests/",
            requirejs: false,
            forceExit: true,
            jUnit: {
                report: true,
                savePath : "docs/jasmine/",
                useDotNotation: true,
                consolidate: true
            }
        },
        jshint: {
            all: ['packages/jsmapper/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                options: {
                    paths: 'packages/jsmapper/',
                    outdir: 'docs/yui'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', ['jshint', 'jasmine_node', 'yuidoc']);
};
