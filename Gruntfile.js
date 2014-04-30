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
                dest: 'tmp/<%= pkg.name %>.js'
            },
            debug: {
                src: 'src/core.js',
                dest: '<%= preprocess.dist.dest %>',
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
                            match: /[ \t]+\n/g,         // Trailing spaces
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
            dist : {
                src : [
                    '<%= preprocess.dist.dest %>'
                ]
            }
        },

        jshint: {
            options: {
                jshintrc : '.jshintrc'
            },
            dist : [ 'src/**/*.js' ]
        },

        watch: {
            dist : {
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
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        }
    });

    grunt.registerTask('default', 'An alias task for quick build.', ['quickbuild']);
    grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint']);
    grunt.registerTask('test', 'Run the unit tests.', ['lint', 'preprocess:dist', 'jasmine:dist', 'clean:tmp']);
   /* grunt.registerTask('dev', 'Auto-test while developing.', ['watch:dist']); */
    grunt.registerTask('build', 'Build our library.', ['replace', 'lint', 'clean', 'preprocess:dist', 'jasmine:dist', 'concat', 'uglify', 'clean:tmp']);
    grunt.registerTask('quickbuild', 'Build our library without time consuming jasmine tests and minifying.', ['replace', 'lint', 'clean', 'preprocess:debug', 'concat', 'clean:tmp']);
};