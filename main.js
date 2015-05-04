(function(){
  "use strict";

  var gl = document.getElementById('glcanvas').getContext('webgl')
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)

})()
