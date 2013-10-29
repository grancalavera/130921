/*global module:false*/
/* jshint node:true */
"use strict";

var path = require('path');
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(path.resolve(dir));
};

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        indent: 2,
        globals: {
          $: false,
          jQuery: false,
          Modernizr: false
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      options: {
        nospawn: true,
        livereload: true,
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          'www/**/*.html',
          'www/css/**/*.css'
        ]
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'bower_components'),
              mountFolder(connect, 'www')
            ];
          }
        }
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('start', ['jshint', 'connect:livereload', 'watch']);

};
