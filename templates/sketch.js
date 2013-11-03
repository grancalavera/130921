/*
 * <%= name %>
 * <%= description %>
 * <%= sketch.title %>
 * <%= sketch.description %>
 * <%= author %>
 * scripts/<%= sketch.name %>.js
 */
(function (lib) {
  var $el = $('#<%= sketch.name %>');
  var size;

  function updateState (state) {
    size = state.size;
    $el.html(state.name + ', ' + size + 'px');
  }

  lib.$body.on('change:state', function (ev, state) {
    updateState(state);
  });

  updateState(lib.state);

})(window.lib || (window.lib = {}));
