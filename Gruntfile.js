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
        watch: {
            dev: {
                files: ['http/public/js/*.js', 'http/public/js/**/*.js'],
                tasks: ['jshint', 'concat:dist'],
                options: {
                    atBegin: true
                }
            },
            min: {
                files: ['http/public/js/*.js', 'http/public/js/**/*.js'],
                tasks: ['jshint', 'concat:dist', 'uglify:dist'],
                options: {
                    atBegin: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['watch:dev']);
    grunt.registerTask('minified', ['watch:min']);
    grunt.registerTask('package', ['concat:dist', 'uglify:dist']);
    grunt.registerTask('package-dev', ['concat:dist']);
};
