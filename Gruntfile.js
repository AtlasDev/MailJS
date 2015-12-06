/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            public: {
                files: {
                    'http/public/dist/js/app.min.js': ['http/public/dist/js/app.min.js'],
                    'http/public/dist/js/login.min.js': ['http/public/dist/js/login.min.js']
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
            login: {
                src: [
                    'http/public/js/other/jquery.min.js',
                    'http/public/js/other/bootstrap.min.js',
                    'http/public/js/other/js.cookie.js',
                    'http/public/js/login.js'
                ],
                dest: 'http/public/dist/js/login.min.js'
            },
            app: {
                src: [
                    'http/public/js/other/jquery.min.js',
                    'http/public/js/other/bootstrap.min.js',
                    'http/public/js/other/bootstrap3-wysihtml5.all.min.js',
                    'http/public/js/other/socketio.min.js',
                    'http/public/js/other/qrcode.js',
                    'http/public/js/other/UAparser.min.js',
                    'http/public/js/angular/angular.min.js',
                    'http/public/js/angular/angular-gravitar.min.js',
                    'http/public/js/angular/angular-animate.js',
                    'http/public/js/angular/angular-mask.js',
                    'http/public/js/angular/angular-qrcode.js',
                    'http/public/js/angular/angular-animate.min.js',
                    'http/public/js/angular/angular-route.min.js',
                    'http/public/js/angular/angular-toastr.tpls.min.js',
                    'http/public/js/angular/angular-cookies.min.js',
                    'http/public/js/angular/angular-translate.min.js',
                    'http/public/js/angular/angular-translate-storagecookie.min.js',
                    'http/public/js/angular/angular-translate-loaderstaticfiles.min.js',
                    'http/public/js/other/adminlte.min.js',

                    'http/public/js/app.js',
                    'http/public/js/controllers/**/*.js',
                    'http/public/js/factorys/*.js'
                ],
                dest: 'http/public/dist/js/app.min.js'
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
                roundingPrecision: -1,
                keepSpecialComments: 0
            },
            target: {
                files: {
                    'http/public/dist/css/style.min.css': [
                        'http/public/css/bootstrap.min.css',
                        'http/public/css/angular-toastr.min.css',
                        'http/public/css/preloader.css',
                        'http/public/css/style.css',
                        'http/public/css/loader.css',
                        'http/public/css/skins/skin-red-light.min.css',
                        'http/public/css/bootstrap3-wysihtml5.min.css',
                        'http/public/css/font-awesome.min.css',
                        'http/public/css/ionicons.min.css',
                        'http/public/css/AdminLTE.min.css'
                    ],
                    'http/public/dist/css/login.min.css': [
                        'http/public/css/bootstrap.min.css',
                        'http/public/css/angular-toastr.min.css',
                        'http/public/css/skins/skin-red-light.min.css',
                        'http/public/css/bootstrap3-wysihtml5.min.css',
                        'http/public/css/AdminLTE.min.css',
                        'http/public/css/font-awesome.min.css',
                        'http/public/css/ionicons.min.css'
                    ]
                }
            }
        },
        watch: {
            all: {
                files: [
                    'http/public/**/*.js'
                ],
                tasks: ['concat:app', 'concat:login', 'cssmin', 'imagemin:public'],
                options: {
                    atBegin: true
                }
            },
            js: {
                files: [
                    'http/public/js/**/*.js'
                ],
                tasks: ['concat:app', 'concat:login'],
                options: {
                    atBegin: true
                }
            },
            css: {
                files: [
                    'http/public/css/**/*.js'
                ],
                tasks: ['cssmin'],
                options: {
                    atBegin: true
                }
            },
            img: {
                files: [
                    'http/public/img/**/*.{png,jpg,gif}'
                ],
                tasks: ['imagemin:public'],
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
        },
        imagemin: {
            public: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'http/public/img/',
                    src: [
                        '**/*.{png,jpg,gif}'
                    ],
                    dest: 'http/public/dist/img/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('dev', [
        'watch:all'
    ]);
    grunt.registerTask('build', [
        'clean:temp',
        'cssmin',
        'concat:app',
        'concat:login',
        'uglify:public',
        'uglify:dist',
        'imagemin:public',
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
    grunt.registerTask('build-dev', [
        'cssmin',
        'concat:app',
        'concat:login'
    ]);
};
