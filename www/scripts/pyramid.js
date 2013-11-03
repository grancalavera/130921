/*
 * 130921
 * Another davidope cover
 * Pyramid
 * Four SVG triangles assambled as a pyramid
 * Leon Coto
 * scripts/pyramid.js
 */
(function (lib) {
  var $el = $('#pyramid');
  $el.addClass('debug');
  var $p;

  function clear () {
    if (!$p) { return; }
    $p.clear();
  }

  function updateState (state) {
    clear();
    var s = state.size * 0.5;
    $p = lib.$pyramid(s, 'top');

    $p.css({
      left: (state.size - $p.bbox.width) / 2,
      top:(state.size - $p.bbox.height) / 2 - $p.baseOffset
    });
    $el.append($p);
  }

  lib.$body.on('change:state', function (ev, state) {
    updateState(state);
  });

  updateState(lib.state);

})(window.lib || (window.lib = {}));
