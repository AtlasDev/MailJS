/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            public: {
                files: {
                    'lib/http/public/dist/js/app.min.js': ['lib/http/public/dist/js/app.min.js'],
                    'lib/http/public/dist/js/login.min.js': ['lib/http/public/dist/js/login.min.js']
                },
                options: {
                    banner: '/*\n   <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev\n'+
                        '   Copyright (C) AtlasDev - All Rights Reserved\n'+
                        '   Unauthorized copying of this file, via any medium is strictly prohibited\n'+
                        '   Proprietary and confidential\n'+
                        '   Written by Dany Sluijk <dany@atlasdev.nl>, January 2016\n*/\n',
                    mangle: false,
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
                    },
                    preserveComments: false
                }
            },
            dist: {
                files: [{
                    expand: true,
                    src: [
						'./**/*.js',
						'./lib/http/*.js',
						'./lib/http/v*/*.js',
						'!./node_modules/**',
						'!./Gruntfile.js',
						'!./builds/**',
						'!./lib/http/public/**',
						'!./lib/http/doc/**',
						'!./lib/http/docfiles/**'
					],
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
                    },
                    preserveComments: false
                }
            },
            app: {
                files: {
                    'tmp/lib/app.js': 'tmp/lib/app.js'
                },
                options: {
                    banner: '#!/usr/bin/env node'+
                        '\n\n/*\n   <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev\n'+
                        '   Copyright (C) AtlasDev - All Rights Reserved\n'+
                        '   Unauthorized copying of this file, via any medium is strictly prohibited\n'+
                        '   Proprietary and confidential\n'+
                        '   Written by Dany Sluijk <dany@atlasdev.nl>, January 2016\n*/\n',
                    preserveComments: false
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            login: {
                src: [
                    'lib/http/public/js/other/jquery.min.js',
                    'lib/http/public/js/other/bootstrap.min.js',
                    'lib/http/public/js/other/js.cookie.js',
                    'lib/http/public/js/login.js'
                ],
                dest: 'lib/http/public/dist/js/login.min.js'
            },
            app: {
                src: [
                    'lib/http/public/js/other/jquery.min.js',
                    'lib/http/public/js/other/bootstrap.min.js',
                    'lib/http/public/js/other/bootstrap3-wysihtml5.all.min.js',
                    'lib/http/public/js/other/qrcode.js',
                    'lib/http/public/js/other/UAParser.min.js',
                    'lib/http/public/js/angular/angular.min.js',
                    'lib/http/public/js/angular/angular-md5.min.js',
                    'lib/http/public/js/angular/angular-animate.js',
                    'lib/http/public/js/angular/angular-mask.js',
                    'lib/http/public/js/angular/angular-qrcode.js',
                    'lib/http/public/js/angular/angular-animate.min.js',
                    'lib/http/public/js/angular/angular-route.min.js',
                    'lib/http/public/js/angular/angular-toastr.tpls.min.js',
                    'lib/http/public/js/angular/angular-cookies.min.js',
                    'lib/http/public/js/angular/angular-websocket.min.js',
                    'lib/http/public/js/angular/angular-translate.min.js',
                    'lib/http/public/js/angular/angular-translate-storagecookie.min.js',
                    'lib/http/public/js/angular/angular-translate-loaderstaticfiles.min.js',
                    'lib/http/public/js/angular/angular-sanitize.min.js',
                    'lib/http/public/js/angular/angular-hotkeys.js',
                    'lib/http/public/js/other/adminlte.min.js',
                    'lib/http/public/js/other/select2.full.min.js',
                    'lib/http/public/js/other/mousetrap.js',

                    'lib/http/public/js/app.js',
                    'lib/http/public/js/controllers/**/*.js',
                    'lib/http/public/js/factorys/*.js'
                ],
                dest: 'lib/http/public/dist/js/app.min.js'
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
                        cwd: 'lib/http/doc',
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
                        cwd: 'tmp/lib/http/public',
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
                        cwd: 'tmp/lib/http/public',
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
                    'lib/http/public/dist/css/style.min.css': [
                        'lib/http/public/css/bootstrap.min.css',
                        'lib/http/public/css/angular-toastr.min.css',
                        'lib/http/public/css/preloader.css',
                        'lib/http/public/css/style.css',
                        'lib/http/public/css/loader.css',
                        'lib/http/public/css/skins/skin-red-light.min.css',
                        'lib/http/public/css/bootstrap3-wysihtml5.min.css',
                        'lib/http/public/css/font-awesome.min.css',
                        'lib/http/public/css/ionicons.min.css',
                        'lib/http/public/css/AdminLTE.min.css',
                        'lib/http/public/css/select2.min.css',
                        'lib/http/public/css/hotkeys.css'
                    ],
                    'lib/http/public/dist/css/login.min.css': [
                        'lib/http/public/css/bootstrap.min.css',
                        'lib/http/public/css/angular-toastr.min.css',
                        'lib/http/public/css/skins/skin-red-light.min.css',
                        'lib/http/public/css/bootstrap3-wysihtml5.min.css',
                        'lib/http/public/css/AdminLTE.min.css',
                        'lib/http/public/css/font-awesome.min.css',
                        'lib/http/public/css/ionicons.min.css'
                    ]
                }
            }
        },
        watch: {
            all: {
                files: [
                    '**/*.js',
                    '**/*.css',
                    '**/*.html',
					'!node_modules/*'
                ],
                tasks: [
                    'jshint:all',
                    'concat:app',
                    'concat:login',
                    'cssmin',
                    'imagemin:public',
                    'copy:favicon',
                    'copy:fonts'
                ],
                options: {
                    atBegin: true
                }
            },
            js: {
                files: [
                    'lib/http/public/js/**/*.js'
                ],
                tasks: ['concat:app', 'concat:login'],
                options: {
                    atBegin: true
                }
            },
            css: {
                files: [
                    'lib/http/public/css/**/*.js'
                ],
                tasks: ['cssmin'],
                options: {
                    atBegin: true
                }
            },
            img: {
                files: [
                    'lib/http/public/img/**/*.{png,jpg,gif,ico}'
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
                cwd: 'lib/http/public/fonts/',
                src: '**',
                dest: 'lib/http/public/dist/fonts'
            },
            favicon: {
                src: ['lib/http/public/img/favicon.ico'],
                dest: 'lib/http/public/dist/img/favicon.ico'
            },
            public: {
                files: [
                    {
                        expand: true,
                        src: [
                            'lib/http/views/**',
                            'lib/http/public/**',
                            '!lib/http/public/css/**',
                            '!lib/http/public/fonts/**',
                            '!lib/http/public/img/**',
                            '!lib/http/public/js/**'
                        ],
                        dest: 'tmp'
                    }
                ]
            }
        },
        'string-replace': {
            app: {
                files: {
                    'tmp/lib/app.js': 'lib/app.js'
                },
                options: {
                    replacements: [{
                        pattern: '#!/usr/bin/env node',
                        replacement: ''
                    }]
                }
            }
        },
        clean: {
            temp: {
                src: ["tmp"]
            },
            client: {
                src: ["tmp/lib/http/public"]
            }
        },
        imagemin: {
            public: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'lib/http/public/img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'lib/http/public/dist/img'
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
                'lib/http/**/*.js',
                '!lib/http/public/dist/**',
                '!lib/http/public/js/other/**',
                '!lib/http/public/js/angular/**',
                '!lib/http/doc/**',
                '!lib/http/docfiles/**',
                'lib/smtp/**/*.js'
            ],
            sys: [
                'sys/**/*.js'
            ],
            http: [
                'lib/http/**/*.js',
                '!lib/http/public/dist/**',
                '!lib/http/public/js/other/**',
                '!lib/http/public/js/angular/**',
                '!lib/http/doc/**',
                '!lib/http/docfiles/**'
            ],
            smtp: [
                'lib/smtp/**/*.js'
            ],
            models: [
                'lib/models/*.js'
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
    grunt.loadNpmTasks('grunt-string-replace');

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
        'string-replace:app',
        'uglify:app',
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
        'jshint:all',
        'concat:app',
        'concat:login',
        'cssmin',
        'imagemin:public',
        'copy:favicon',
        'copy:fonts'
    ]);
};
