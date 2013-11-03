/*
 * 130921
 * Another davidope cover
 * Four Triangles
 * Four triangles with different transformations applied to them
 * Leon Coto
 * scripts/four-triangles.js
 */
(function (lib) {

  var $el = $('#four-triangles');
  $el.addClass('debug');
  var margin = 4;
  var faces = ['front', 'right', 'back', 'left'];
  var triangles = [];

  function clear () {
    triangles.forEach(function ($t) {
      $t.paper.clear();
      $t.remove();
    });
  }

  function render (size) {
    var space = size - (margin * 5);
    var s = space / 4;
    return faces.map(function (face) {
      var $t = lib.$triangle(s, face);
      $t.t1.attr({ 'fill': lib.colors.light });
      $t.t2.attr({ 'fill': lib.colors.dark });
      $t.css({
        'margin-top': ((size - s) / 2) - $t.baseOffset,
        'margin-left': margin
      });
      $el.append($t);
      return $t;
    });
  }

  function updateState (state) {
    clear();
    triangles = render(state.size);
  }

  lib.$body.on('change:state', function (ev, state) {
    updateState(state);
  });
  updateState(lib.state);


})(window.lib || (window.lib = {}));
