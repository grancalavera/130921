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

  var colors = lib.colors = {
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
  lib.triangle = function (size) {
    var half_s = size / 2;
    var h = Math.sqrt(size * size - half_s * half_s);
    return polygon(pos.M(half_s, 0), pos.L(size, h), pos.L(0, h));
  };

  updateState();
  $win.on('resize', updateState);

})(window.lib || (window.lib = {}));
