module.exports = function(grunt) {

    require('time-grunt')(grunt);

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
                        },
                        {
                            match: /[ \t]+\n/g,         // Trailing spaces
                            replacement: '\n'
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
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            dist: {
                options : {
                    ASCIIOnly: true,
                    sourceMap: true,
                    banner: "<%= banner %>"
                },
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        jasmine: {
            options: {
                helpers: [],
                specs: 'spec/code/**/*.spec.js',
                vendor: [],
                keepRunner: true
            },
            concat: {
                src: ['<%= concat.dist.dest %>']
            },
            uglify: {
                src: ['<%= uglify.dist.dest %>']
            }
        },

        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['spec/code/']
        },


        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            dist: [ 'src/**/*.js' ]
        },

        watch: {
            dist: {
                files: ['src/**/*.js', 'spec/**/*.js'],
                tasks: ['test']
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
        },

        notify: {
            success: {
                options: {
                    title: 'Build complete',  // optional
                    message: '<%= pkg.name %> build finished successfully.' //required
                }
            }
        }
    });

    grunt.registerTask('prebuild', ['replace', 'lint', 'clean']);
    grunt.registerTask('postbuild', ['clean:tmp', 'notify:success']);

    grunt.registerTask('default', 'An alias task for build.', ['build']);
    grunt.registerTask('lint', 'Lints our sources', ['lintspaces', 'jshint']);
    grunt.registerTask('test', 'Run the unit tests.', ['prebuild', 'concat', 'jasmine:concat', 'clean:tmp']);
   /* grunt.registerTask('dev', 'Auto-test while developing.', ['watch:dist']); */
    grunt.registerTask('nodebuild', 'Build our library with jasmine node test.', ['prebuild', 'preprocess:dist', 'concat', 'jasmine_node', 'postbuild']);
    grunt.registerTask('build', 'Build our library.', ['prebuild', 'preprocess:dist', 'concat', 'uglify', 'jasmine:concat', 'jasmine:uglify', 'postbuild']);
    grunt.registerTask('quickbuild', 'Build our library without time consuming jasmine tests and minifying.', ['prebuild', 'preprocess:debug', 'concat', 'postbuild']);
};