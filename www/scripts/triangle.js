/*
 * 130921
 * Another davidope cover
 * Triangle
 * A single SVG triangle
 * Leon Coto
 * scripts/triangle.js
 */
(function (lib) {
  var $el = $('#triangle');
  var size, paper;

  function updateState (state) {
    if (paper) { paper.clear(); }
    size = state.size;

    paper = Raphael($el[0], size, size);

    var s = size * 0.9;
    var sw = s * 0.1;

    var t = paper.path(lib.triangle(s));
    var bb = t.getBBox();
    var x = (size - bb.width) / 2;
    var y = (size - bb.height) / 2;

    t.attr({
      'fill': lib.colors.dark,
      'stroke': lib.colors.light,
      'stroke-width': sw,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });

    t.transform(lib.pos.t(x, y));

  }

  lib.$body.on('change:state', function (ev, state) {
    updateState(state);
  });

  updateState(lib.state);

})(window.lib || (window.lib = {}));
