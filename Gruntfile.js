/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            public: {
                files: {
                    'http/public/dist/app.min.js': ['http/public/dist/app.min.js'],
                    'http/public/dist/login.min.js': ['http/public/dist/login.min.js']
                },
                options: {
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev*/',
                    mangle: false,
                    screwIE8: true
                }
            },
            dist: {
                files: [{
                    expand: true,
                    src: ['**/*.js', '!http/doc/**', '!http/docfiles/**', '!http/public/**', '!node_modules/**', '!builds/**', '!Gruntfile.js'],
                    dest: 'tmp'
                }],
                options: {
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev*/',
                    mangle: false,
                    screwIE8: true
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            app: {
                src: [
                    'http/public/js/other/js.cookie.js',
                    'http/public/js/login.js'
                ],
                dest: 'http/public/dist/login.min.js'
            },
            login: {
                src: [
                    'http/public/js/app.js',
                    'http/public/js/angular/*.js',
                    'http/public/js/controllers/*.js',
                    'http/public/js/controllers/settings/*.js',
                    'http/public/js/factorys/*.js',
                    'http/public/js/other/*.js',
                    '!http/public/js/other/js.cookie.js'
                ],
                dest: 'http/public/dist/app.min.js'
            }
        },
        compress: {
            fullGzip: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-full.zip',
                    level: 9,
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/',
                        src: '**/*',
                        dest: 'mailjs',
                        mode: 'gzip'
                    }
                ]
            },
            fullTgz: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-full.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/',
                        src: '**/*',
                        dest: 'mailjs',
                        mode: 'tgz'
                    }
                ]
            },
            docGzip: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-docs.zip',
                    level: 9,
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'http/doc',
                        src: '**/*',
                        dest: 'docs',
                        mode: 'gzip'
                    }
                ]
            },
            clientGzip: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-client.zip',
                    level: 9,
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/http/public',
                        src: '**/*',
                        dest: 'public',
                        mode: 'gzip'
                    }
                ]
            },
            clientTgz: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-client.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/http/public',
                        src: '**/*',
                        dest: 'public',
                        mode: 'tgz'
                    }
                ]
            },
            serverGzip: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-server.zip',
                    level: 9,
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/',
                        src: '**/*',
                        dest: 'server',
                        mode: 'gzip'
                    }
                ]
            },
            serverTgz: {
                options: {
                    archive: 'builds/<%= pkg.name %>-<%= pkg.version %>-server.tar.gz',
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'tmp/',
                        src: '**/*',
                        dest: 'server',
                        mode: 'tgz'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'http/public/dist/style.css': [
                        'http/public/css/angular-toastr.min.css',
                        'http/public/css/preloader.css',
                        'http/public/css/style.css',
                        'http/public/css/loader.css',
                        'http/public/css/skins/skin-red-light.min.css',
                        'http/public/css/bootstrap3-wysihtml5.min.css'
                    ]
                }
            }
        },
        watch: {
            js: {
                files: [
                    'http/public/js/app.js',
                    'http/public/js/angular/*.js',
                    'http/public/js/controllers/*.js',
                    'http/public/js/controllers/settings/*.js',
                    'http/public/js/factorys/*.js',
                    'http/public/js/other/*.js',
                    '!http/public/js/other/js.cookie.js'
                ],
                tasks: ['concat:app', 'concat:login'],
                options: {
                    atBegin: true
                }
            },
            css: {
                files: [
                    'http/public/css/angular-toastr.min.css',
                    'http/public/css/preloader.css',
                    'http/public/css/style.css',
                    'http/public/css/loader.css',
                    'http/public/css/skins/skin-red-light.min.css',
                    'http/public/css/bootstrap3-wysihtml5.min.css'
                ],
                tasks: ['cssmin'],
                options: {
                    atBegin: true
                }
            }
        },
        copy: {
            json: {
                files: [
                    {
                        src: 'config.json',
                        dest: 'tmp/'
                    },
                    {
                        src: 'package.json',
                        dest: 'tmp/'
                    }
                ]
            },
            public: {
                files: [
                    {
                        expand: true,
                        src: [
                            'http/*.js',
                            'http/v**/**',
                            'http/views/**',
                            'http/public/dist/**',
                            'http/public/lang/**',
                            'http/public/pages/**',
                            'http/public/*.html',
                            '!http/doc/**',
                            '!http/docfiles/**'
                        ],
                        dest: 'tmp'
                    }
                ]
            }
        },
        clean: {
            temp: {
                src: ["tmp"]
            },
            client: {
                src: ["tmp/http/public"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('dev', [
        'watch:js',
        'watch:css'
    ]);
    grunt.registerTask('build', [
        'clean:temp',
        'cssmin',
        'concat:app',
        'concat:login',
        'uglify:public',
        'uglify:dist',
        'copy:json',
        'copy:public',
        'compress:fullGzip',
        'compress:fullTgz',
        'compress:docGzip',
        'compress:clientGzip',
        'compress:clientTgz',
        'clean:client',
        'compress:serverGzip',
        'compress:serverTgz',
        'clean:temp'
    ]);
};
