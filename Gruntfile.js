/*jslint node: true */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                files: {
                    'http/public/dist/app.min.js': ['http/public/dist/app.min.js']
                },
                options: {
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %> © AtlasDev*/',
                    mangle: false
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
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
            devjs: {
                files: [
                    'http/public/js/app.js',
                    'http/public/js/angular/*.js',
                    'http/public/js/controllers/*.js',
                    'http/public/js/controllers/settings/*.js',
                    'http/public/js/factorys/*.js',
                    'http/public/js/other/*.js',
                    '!http/public/js/other/js.cookie.js',
                ],
                tasks: ['concat:dist'],
                options: {
                    atBegin: true
                }
            },
            minjs: {
                files: [
                    'http/public/js/app.js',
                    'http/public/js/angular/*.js',
                    'http/public/js/controllers/*.js',
                    'http/public/js/controllers/settings/*.js',
                    'http/public/js/factorys/*.js',
                    'http/public/js/other/*.js',
                    '!http/public/js/other/js.cookie.js'
                ],
                tasks: ['concat:dist', 'uglify:dist'],
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('dev', ['watch:devjs', 'watch:css']);
    grunt.registerTask('minified', ['watch:minjs', 'watch:css']);
    grunt.registerTask('package', ['cssmin', 'concat:dist', 'uglify:dist']);
    grunt.registerTask('package-dev', ['cssmin', 'concat:dist']);
};
