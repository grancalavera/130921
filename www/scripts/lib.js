/*
 * 130921
 * Another davidope cover
 * Leon Coto
 * scripts/lib.js
 */
(function (lib) {

  lib.version = '0.1.0';
  lib.state = {};

  var beyondMobile = 501;
  var sizes = {
    mobile: 320,
    beyondMobile: 500
  };

  lib.colors = {

    // Theme
    darkest: '#000000',
    dark: '#212121',
    light: '#929292',
    lighter: '#ffffff',

    // Faces
    'top-front': '#fb5228',
    'top-right': '#5e207e',
    'top-back': '#0ddcce',
    'top-left': '#fbd503',
    'bottom-front': '#fb5228',
    'bottom-right': '#5e207e',
    'bottom-back': '#0ddcce',
    'bottom-left': '#fbd503',

  };

  var slice = Array.prototype.slice;
  var $body = lib.$body = $('body');
  var $win = lib.$win = $(window);


  function updateState () {
    var name = lib.width() < beyondMobile ? 'mobile' : 'beyondMobile';
    if (name !== lib.state.name) {
      lib.state = { name: name, size: sizes[name] };
      $body.trigger('change:state', lib.state);
    }
  }

  function posCmd (cmd) {
    return function (x, y) {
      return cmd + x + ',' + y;
    };
  }

  var pos = lib.pos = {
    M: posCmd('M'),
    L: posCmd('L'),
    t: posCmd('t'),
  };

  function polygon () {
    var points = slice.call(arguments, 0);
    points.push('Z');
    return points.join('');
  }


  lib.width = function () {
    return $body.width();
  };

  /*
   * Draws an equilateral triangle. The triangle's bounding box will be
   * defined by the height and the base of the triangle.
   */
  var triangle = lib.triangle = function (size) {
    var half_s = size / 2;
    var h = Math.sqrt(size * size - half_s * half_s);
    return polygon(pos.M(half_s, 0), pos.L(size, h), pos.L(0, h));
  };

  /*
   * One triangle inside another triangle wrapped inside a <div> element
   * wrapped inside a jQuery function.
   */
  var $triangle = lib.$triangle = function (size, className) {
    var $t = $('<div class="triangle">');
    var p = Raphael($t[0], size, size);
    $t.paper = p;

    function make_t (s) {
      var t = p.path(triangle(s)).attr('stroke', 'none');
      t.size = s;
      return t;
    }

    $t.addClass(className);
    $t.css({
      width: size,
      height: size
    });

    $t.t1 = make_t(size);
    $t.t2 = make_t(size * 0.95);

    var h = $t.t1.getBBox().height;
    var base = size - h;
    var x = (size - $t.t2.getBBox().width) / 2;
    var y = (base + x * 2) - x * 0.85;

    $t.t1.transform(pos.t(0, base));
    $t.t2.transform(pos.t(x, y));
    $t.baseOffset= base;

    return $t;
  };

  lib.$pyramid = function (size, className) {
    var faces = ['front', 'right', 'back', 'left'];
    var triangles = [];
    var $p = $('<div class="pyramid">');

    $p.css({
      width: size,
      height: size
    });

    $p.addClass(className);

    $p.clear = function () {
      triangles.forEach(function ($t) {
        $t.paper.clear();
        $t.remove();
      });
      $p.remove();
      triangles = [];
    };

    triangles = faces.map(function (face) {
      var c = lib.colors[className + '-' + face];
      var $t = $triangle(size, face);
      $t.t1.attr({ fill: lib.colors.darkest });
      $t.t2.attr({ fill: c });
      $p.append($t);
      return $t;
    });

    $p.bbox = triangles[0].t1.getBBox();
    $p.baseOffset = triangles[0].baseOffset;

    return $p;
  };

  updateState();
  $win.on('resize', updateState);

})(window.lib || (window.lib = {}));
