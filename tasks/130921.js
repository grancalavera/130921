/* jshint node:true */

'use strict';
module.exports = function (grunt) {

  var _ = grunt.util._;
  var path = require('path');
  var pkg = grunt.file.readJSON('package.json');

  function processT (template, context) {
    context = _.extend(pkg, context);
    template = grunt.file.read(path.join('templates', template));
    return grunt.template.process(template, { data: context });
  }

  grunt.registerTask('update', function () {
    var index = processT('index.html');
    grunt.file.write('www/index.html', index);
  });
};
