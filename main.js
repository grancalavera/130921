(function(){

  "use strict";

  var t = THREE
    , scene = new t.Scene()
    , renderer = getRenderer()
    , camera = getCamera()
    , viewSize = 500

  document.getElementById('main-container').appendChild(renderer.domElement)
  populateScene(scene)

  render()

  function populateScene(scene) {
    var size = 11
      , margin = 50
      , cols = 30
      , rows = 30
      , cellSize = (viewSize - margin * 2) / Math.max(cols, rows)
      , grid = getGrid(rows, cols)
      , rotationIncrement = Math.PI * 2 / 15

    _.range(0, rows * cols).forEach(function(index) {

      var object = getObject(size)
        , coords = grid.getCoords(index)

      object.position.setX(
          coords.x * cellSize
        + margin
        - viewSize / 2
        + cellSize / 2
        )

      object.position.setY(
          coords.y * cellSize
        + margin
        - viewSize / 2
        + cellSize / 2
        )

      object.rotation.x = coords.x * rotationIncrement
      object.rotation.z = coords.y * rotationIncrement

      scene.add(object)
    })
  }

  function render() {
    var speed = 0.05
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    scene.children.forEach(function(object) {
      object.rotation.y -= speed
      object.rotation.z += speed
    })
  }

  function getRenderer() {
    var r = new t.WebGLRenderer()
    r.setSize(500, 500)
    return r
  }

  function getCamera() {
    var aspectRatio = 1
      , viewSize = 500
      , nearFar = 500

    return new t.OrthographicCamera(
          -aspectRatio * viewSize / 2
        , aspectRatio * viewSize / 2
        , viewSize / 2
        , -viewSize / 2
        , -nearFar
        , nearFar
        )
  }

  function getObject(size) {
    return new t.Mesh(getGeometry(size), getMaterial())
  }

  function getMaterial() {
    return new t.MeshBasicMaterial({ vertexColors: t.FaceColors })
  }

  function getGeometry(size) {
    var red1 = 0xe52c21
      , red2 = 0xfb5220
      , yellow1 = 0xffea00
      , yellow2 = 0xfdb70f
      , purple = 0x5e207e
      , cyan = 0x0feada
      , green = 0x52e988
      , geometry = new t.Geometry()
      , x = size * 0.8
      , y = size * 5
      , z = size * 0.8

    geometry.vertices.push(
        new t.Vector3(-x, 0, z)
      , new t.Vector3(x, 0, z)
      , new t.Vector3(0, y, 0)
      , new t.Vector3(x, 0, -z)
      , new t.Vector3(-x, 0, -z)
      , new t.Vector3(0, -y, 0)
      )

    geometry.faces.push(
        getFaceWithColor(0, 1, 2, red1)
      , getFaceWithColor(0, 5, 1, red2)
      , getFaceWithColor(1, 3, 2, purple)
      , getFaceWithColor(1, 5, 3, cyan)
      , getFaceWithColor(2, 3, 4, cyan)
      , getFaceWithColor(4, 3, 5, green)
      , getFaceWithColor(0, 2, 4, yellow1)
      , getFaceWithColor(0, 4, 5, yellow2)
      )

    return geometry
  }

  function getFaceWithColor(v1, v2, v3, color) {
    var f = new t.Face3(v1, v2, v3)
    f.color.setHex(color)
    return f
  }

  function getGrid(rows, cols) {

    return { getCoords: getCoords }

    function getCoords(n) {
      return { x: x(n), y: y(n) }
    }

    function x(n) {
      return n % cols
    }

    function y(n) {
      return Math.floor(n / cols)
    }
  }

})()
