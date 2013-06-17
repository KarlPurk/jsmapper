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
        },
        concat: {
            dist: {
                options: {
                    banner: "this.file.read('./packages/jsmapper-browser/main.js')"
                },
                src: ['packages/jsmapper/transport/*.js', 'packages/jsmapper/util/*.js', 'packages/jsmapper/mapper/*.js'],
                dest: 'dist/jsmapper.js'
            },
            "browser-tests": {
                src: [  'tests/jsmapper/mapper.spec.js',
                        'tests/jsmapper/promise-mapper.spec.js',
                        'tests/jsmapper/transport-default.spec.js',
                        'tests/jsmapper/transport-jquery.spec.js'],
                dest: 'dist/specs.js'
            }
        },
        "regex-replace": {
            dist: {
                src: ['dist/jsmapper.js', 'dist/specs.js'],
                actions: [
                    {
                        name: 'Replace require() calls',
                        search: "require\\('.*?/loader'\\)\\.load\\('(.*?)(?:\\.js)?'\\)",
                        replace: function() {
                            var path = arguments[1];
                            path = path.replace(/^\/([a-z])/i, '$1');
                            // Uppercase words
                            path = path.replace(/^([a-z])|(?:\/|-)([a-z])/g, function ($1) { return $1.toUpperCase(); });
                            path = path.replace('/', '.');
                            path = path.replace('-', '');

                            // We want JQuery instead of Jquery so we need to create this hack to achieve it :(
                            path = path.replace('Transport.Jquery', 'Transport.JQuery');
                            path = 'JsMapper.' + path;
                            return path;
                        },
                        flags: 'g'
                    },
                    {
                        name: 'Replace module.exports with return',
                        search: "module.exports\\s+=",
                        replace: "return",
                        flags: 'g'
                    },
                    {
                        name: 'Replace node-specifc "var JsMapper =" statements',
                        search: "^var\\s+JsMapper\\s+=.*?;$\\r\\n",
                        replace: "",
                        flags: 'gm'
                    }
                ]
            }
        },
        jasmine: {
            dist: {
                src: 'dist/jsmapper.js',
                options: {
                    specs: 'dist/specs.js'
                }
            },
            "browser-dist-coverage": {
                src: ['dist/jsmapper.js'],
                options: {
                    specs: ['tests/jsmapper/*.js'],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'docs/coverage/coverage.json',
                        report: 'docs/coverage',
                        thresholds: {
                            lines: 75,
                            statements: 75,
                            branches: 75,
                            functions: 90
                        }
                    }
                }
            }
        },
        copy: {
            examples: {
                files: [
                    {expand: true, flatten: true, src: ['dist/jsmapper.min.js'], dest: 'examples/web'}
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/jsmapper.min.js': ['dist/jsmapper.js']
                }
            }
        },
        clean: {
            "browser-tests": ["dist/specs.js"],
            "dist": ["dist/*"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-template-jasmine-istanbul');

    grunt.registerTask('default', ['build', 'clean:browser-tests']);
    grunt.registerTask('build', ['jshint', 'jasmine_node', 'concat', 'regex-replace', 'jasmine:dist', 'uglify', 'copy:examples', 'yuidoc']);
    grunt.registerTask('test', ['jshint', 'jasmine_node', 'concat', 'regex-replace', 'jasmine:dist', 'clean:dist']);

    // Node only tests - used on Travis for the moment because browser tests keep failing on Travis :(
    grunt.registerTask('test-node', ['jshint', 'jasmine_node']);

    grunt.registerTask('browser-dist-coverage', ['default', 'jasmine:browser-dist-coverage', 'clean:browser-tests']);
};
