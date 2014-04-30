module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*']
    });

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: '<%= pkg.version %>',
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n',

        clean: {
            dist: 'dist',
            tmp: 'tmp'
        },

        preprocess: {
            dist: {
                src: 'src/core.js',
                dest: 'tmp/MSTools.js'
            },
            debug: {
                src: 'src/core.js',
                dest: 'tmp/MSTools.js',
                options: {
                    context: {
                        DEBUG: true
                    }
                }
            }
        },

        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\t/g,               // Tabs to spaces
                            replacement: '    '
                        }, {
                            match: /[ \t\s]+$/g,        // Trailing spaces  TODO: or tabs
                            replacement: ''
                        }
                    ]
                },
                files: [
                    {
                        src: 'src/**/*.js',
                        dest: './'
                    }
                ]
            }
        },

        concat: {
            options: {
                banner: "<%= banner %>"
            },
            dist: {
                src: '<%= preprocess.dist.dest %>',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        uglify : {
            dist: {
                src : '<%= concat.dist.dest %>',
                dest : 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
                options : {
                    banner: "<%= banner %>",
                    sourceMap : 'dist/<%= pkg.name %>-<%= pkg.version %>.map'
                }
            }
        },

        jasmine : {
            options : {
                helpers : [],
                specs : 'spec/code/**/*.spec.js',
                vendor : [],
                keepRunner: true
            },
            MSTools : {
                src : [
                    '<%= preprocess.dist.dest %>'
                ]
            }
        },

        jshint: {
            options: {
                jshintrc : '.jshintrc'
            },
            MSTools : [ 'src/**/*.js' ]
        },

        watch: {
            MSTools : {
                files : ['src/**/*.js', 'spec/**/*.js'],
                tasks : ['test']
            }
        },

        lintspaces: {
            all: {
                src: [
                    'src/**/*.js'
                ],
                options: {
                    editorconfig: '.editorconfig'
                }
            }
        }
    });

    grunt.registerTask('default', 'An alias task for quick build.', ['quickbuild']);
    grunt.registerTask('lint', 'Lints our sources', ['replace', 'lintspaces', 'jshint']);
    grunt.registerTask('test', 'Run the unit tests.', ['lint', 'preprocess:dist', 'jasmine:MSTools', 'clean:tmp']);
   /* grunt.registerTask('dev', 'Auto-test while developing.', ['watch:MSTools']); */
    grunt.registerTask('build', 'Build our library.', ['clean', 'lint', 'preprocess:dist', 'jasmine:MSTools', 'concat', 'uglify', 'clean:tmp']);
    grunt.registerTask('quickbuild', 'Build our library without time consuming jasmine tests and minifying.', ['lint', 'clean', 'preprocess:debug', 'concat', 'clean:tmp']);
};