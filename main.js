/* global THREE */

(function(){

  "use strict";

  var t = THREE
    , scene = new t.Scene()
    , renderer = getRenderer()
    , object = getObject()
    , camera = getCamera()
    , r = 0.05

  document.getElementById('main-container').appendChild(renderer.domElement)
  // object.rotation.x = Math.PI / 2
  // object.rotation.x = 1
  object.rotation.x = Math.PI / 4
  scene.add(object)
  render()

  function render() {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    object.rotation.y += r
  }

  function getRenderer() {
    var r = new t.WebGLRenderer()
    r.setSize(500, 500)
    return r
  }
  function getCamera() {
    var aspectRatio = 1
      , viewSize = 10
      , nearFar = 600
      , c = new t.OrthographicCamera(
          -aspectRatio * viewSize / 2 // left
        , aspectRatio * viewSize / 2  // right
        , viewSize / 2                // top
        , -viewSize / 2               // bottom
        , -nearFar                    // near
        , nearFar                     // far
        )

    return c
  }

  function getObject() {
    var size = 5
      , geometry = new t.BoxGeometry(size, size, size)
      , material = new t.MeshBasicMaterial({vertexColors: THREE.FaceColors, overdraw: 0.5 })

    geometry.faces.reduce(function(prevFace, currFace, i) {
      if (i % 2 === 0) return currFace
      var hex = Math.random() * 0xffffff
      prevFace.color.setHex(hex)
      currFace.color.setHex(hex)
    })

    return new t.Mesh(geometry, material)
  }

})()
