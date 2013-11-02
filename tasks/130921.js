/* jshint node:true */
'use strict';
var path = require('path');

module.exports = function (grunt) {

  //--------------------------------------------------------------------------
  //
  // Setup
  //
  //--------------------------------------------------------------------------

  var _ = grunt.util._;
  var project_f = '130921.json';
  var flags = [
    'force'
  ];
  var pkg = grunt.file.readJSON('package.json');
  var config = grunt.config('130921');

  //--------------------------------------------------------------------------
  //
  // Util
  //
  //--------------------------------------------------------------------------

  function readProject () {
    return grunt.file.readJSON(project_f);
  }

  function writeF (filepath, contents) {
    grunt.file.write(filepath, contents);
  }

  function processT (template, context) {
    template = grunt.file.read(path.join('templates', template));
    return grunt.template.process(template, { data: context });
  }

  function writeT (template, filepath, context) {
    var contents = processT(template, context);
    writeF(filepath, contents);
  }

  function removeFlags (args) {
    return _.difference(args, flags);
  }

  function saveSketch (sketch, force) {
    var project = readProject();
    var sketches = project.sketches;
    var exists = sketches[sketch.name];
    if (exists && !force) {
      grunt.fatal('Sketch already exits, use ":force" to continue.');
    }
    if (exists && force) {
      grunt.log.writeln('Sketch already exists and will be overwriten.'.yellow);
    }
    sketches[sketch.name] = sketch;
    _.extend(project.sketches, sketches);
    writeF(project_f, JSON.stringify(project, null, 2));
  }

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  //--------------------------------------------------------------------------
  //
  // Tasks
  //
  //--------------------------------------------------------------------------

  grunt.registerTask('update', function () {
    var project = readProject();
    var context = _.extend(pkg, config.dev, project);
    _(project.sketches).chain().map(function (sketch) {
      var c = _.extend({}, context, {
        'sketch_name': sketch.name,
        'sketch_desc': sketch.desc,
        'sketch_title': sketch.title,
      });
      c.css = _.clone(c.css);
      c.js = _.clone(c.js);
      c.css.push('css/' + sketch.name + '.css');
      c.js.push('scripts/' + sketch.name + '.js');
      return [ 'sketch.html', 'www/' + sketch.name + '.html', c ];
    }).
    tap(function (templates) {
      templates.push([ 'index.html', 'www/index.html', context ]);
      return templates;
    })
    .each(function (args) {
      writeT.apply(null, args);
    });
    grunt.log.ok();
  });

  grunt.registerTask('sketch', function () {
    var force = this.flags.force;
    var args = removeFlags(this.args);
    var name = args.shift();
    var sketch = {
      name: name,
      description: args.shift(),
      title: toTitleCase(name.split('-').join(' '))
    };
    saveSketch(sketch, force);
    var context = _.extend({}, pkg, { sketch: sketch });
    writeT('sketch.scss', 'www/styles/' + sketch.name + '.scss', context);
    writeT('sketch.js', 'www/scripts/' + sketch.name + '.js', context);
    grunt.task.run([ 'update', 'compass:dev' ]);
    grunt.log.ok();
  });

};
