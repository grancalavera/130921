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
    darkest: '#000000',
    dark: '#212121',
    light: '#929292',
    lighter: '#ffffff'
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
  lib.$triangle = function (size, className) {
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
      height: size,
      display: 'inline-block'
    });

    $t.t1 = make_t(size);
    $t.t2 = make_t(size * 0.9);

    var h = $t.t1.getBBox().height;
    var base = size - h;
    var x = (size - $t.t2.getBBox().width) / 2;
    var y = (base + x * 2) - x * 0.85;

    $t.t1.transform(pos.t(0, base));
    $t.t2.transform(pos.t(x, y));
    $t.baseOffset= base;

    return $t;
  };

  updateState();
  $win.on('resize', updateState);

})(window.lib || (window.lib = {}));
