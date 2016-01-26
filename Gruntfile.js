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
                    banner: '/*\n   <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev\n'+
                        '   Copyright (C) AtlasDev - All Rights Reserved\n'+
                        '   Unauthorized copying of this file, via any medium is strictly prohibited\n'+
                        '   Proprietary and confidential\n'+
                        '   Written by Dany Sluijk <dany@atlasdev.nl>, January 2016\n*/\n',
                    mangle: true,
                    screwIE8: true,
                    compress: {
                        sequences: true,
                        properties: true,
                        conditionals: true,
                        comparisons: true,
                        evaluate: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        keep_fargs: true,
                        keep_fnames: true
                    }
                }
            },
            dist: {
                files: [{
                    expand: true,
                    src: ['./**/*.js', './http/*.js', './http/v*/*.js', '!./node_modules/**', '!./Gruntfile.js', '!./builds/**', '!./http/public/**', '!./http/doc/**', '!./http/docfiles/**'],
                    dest: 'tmp'
                }],
                options: {
                    banner: '/*\n   <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev\n'+
                        '   Copyright (C) AtlasDev - All Rights Reserved\n'+
                        '   Unauthorized copying of this file, via any medium is strictly prohibited\n'+
                        '   Proprietary and confidential\n'+
                        '   Written by Dany Sluijk <dany@atlasdev.nl>, January 2016\n*/\n',
                    mangle: true,
                    screwIE8: true,
                    compress: {
                        sequences: true,
                        properties: true,
                        conditionals: true,
                        comparisons: true,
                        evaluate: true,
                        booleans: true,
                        loops: true,
                        unused: true,
                        if_return: true,
                        join_vars: true,
                        warnings: true,
                        keep_fargs: true,
                        keep_fnames: true
                    }
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
                    'http/public/js/other/UAParser.min.js',
                    'http/public/js/angular/angular.min.js',
                    'http/public/js/angular/angular-md5.min.js',
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
                    'http/public/js/angular/angular-sanitize.min.js',
                    'http/public/js/other/adminlte.min.js',
                    'http/public/js/other/select2.full.min.js',

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
                        'http/public/css/AdminLTE.min.css',
                        'http/public/css/select2.min.css'
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
                    'http/public/**/*.js',
                    'http/public/**/*.css'
                ],
                tasks: ['jshint:all', 'concat:app', 'concat:login', 'cssmin', 'imagemin:public', 'copy:favicon', 'copy:fonts'],
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
                    'http/public/img/**/*.{png,jpg,gif,ico}'
                ],
                tasks: ['imagemin:public', 'copy:favicon'],
                options: {
                    atBegin: true
                }
            }
        },
        copy: {
            json: {
                files: [
                    {
                        src: 'config.default.json',
                        dest: 'tmp/config.json'
                    },
                    {
                        src: 'package.json',
                        dest: 'tmp/'
                    }
                ]
            },
            fonts: {
                expand: true,
                cwd: 'http/public/fonts/',
                src: '**',
                dest: 'http/public/dist/fonts'
            },
            favicon: {
                src: ['http/public/img/favicon.ico'],
                dest: 'http/public/dist/img/favicon.ico'
            },
            public: {
                files: [
                    {
                        expand: true,
                        src: [
                            'http/views/**',
                            'http/public/**'
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
                    cwd: 'http/public/img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'http/public/dist/img'
                }]
            }
        },
        jshint: {
            options: {
                globals: {
                    require: true,
                    process: true,
                    exports: true,
                    console: true,
                    module: true,
                    element: true,
                    document: true,
                    window: true,
                    $: true,
                    Cookies: true,
                    io: true,
                    app: true,
                    localStorage: true,
                    Notification: true,
                    $window: true,
                    Element: true,
                    confirm: true,
                    angular: true,
                    prompt: true
                },
                'loopfunc': true
            },
            all: [
                'sys/*.js',
                'models/*.js',
                'http/**/*.js',
                '!http/public/dist/**',
                '!http/public/js/other/**',
                '!http/public/js/angular/**',
                '!http/doc/**',
                '!http/docfiles/**',
                'smtp/**/*.js'
            ],
            sys: [
                'sys/**/*.js'
            ],
            http: [
                'http/**/*.js',
                '!http/public/dist/**',
                '!http/public/js/other/**',
                '!http/public/js/angular/**',
                '!http/doc/**',
                '!http/docfiles/**'
            ],
            smtp: [
                'smtp/**/*.js'
            ],
            models: [
                'models/*.js'
            ]
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
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('dev', [
        'watch:all'
    ]);
    grunt.registerTask('hint', [
        'jshint:all'
    ]);
    grunt.registerTask('syshint', [
        'jshint:sys'
    ]);
    grunt.registerTask('httphint', [
        'jshint:http'
    ]);
    grunt.registerTask('smtphint', [
        'jshint:http'
    ]);
    grunt.registerTask('modelshint', [
        'jshint:models'
    ]);
    grunt.registerTask('build', [
        'clean:temp',
        'jshint:all',
        'cssmin',
        'concat:app',
        'concat:login',
        'uglify:public',
        'uglify:dist',
        'imagemin:public',
        'copy:favicon',
        'copy:json',
        'copy:fonts',
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
