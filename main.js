(function(){

  "use strict";

  var scene = new THREE.Scene()
    , stats = getStats()
    , renderer = getRenderer()
    , viewSize = 500
    , margin = 50
    , rows = 20
    , cols = 20
    , size = 9
    , grid = getGrid(rows, cols)
    , camera = getCamera(viewSize)
    , cellSize = (viewSize - margin * 2) / Math.max(cols, rows)
    , speed = document.getElementById('speed')
    , pause = document.getElementById('pause')

  document.getElementById('main-container').appendChild(renderer.domElement)
  document.body.appendChild(stats.domElement)
  populateScene(scene)
  loop(now())

  function loop(lastTime) {
    var currentTime = now()

    stats.begin()
    if(!pause.checked) update(currentTime - lastTime)
    render()
    stats.end()

    requestAnimationFrame(function() {
      loop(currentTime)
    })
  }

  function update(elapsedTime) {
    var angle = revolutions(1) / speed.value * elapsedTime

    scene.children.forEach(function(object) {
      var r = rotationMatrix(
          object.rotation.x
        , object.rotation.y
        , object.rotation.z
        )
        , r1 = new THREE.Matrix4()

      r1.makeRotationY(angle)
      r.multiply(r1)

      object.setRotationFromMatrix(r)
    })
  }

  function render() {
    renderer.render(scene, camera)
  }

  function now() {
    return Date.now()
  }

  function revolutions(count) {
    return Math.PI * 2 * count
  }

  function populateScene(scene) {
    var index
      , object
      , coords
      , r

    for (index = 0; index < rows * cols; index += 1) {
      object = getObject(size)
      coords = grid.getCoords(index)

      object.position.setX(
          coords.x * cellSize
        - viewSize / 2
        + margin
        + cellSize / 2
        )

      object.position.setY(
          coords.y * cellSize * -1
        + viewSize / 2
        - margin
        - cellSize / 2
        )

      r = rotationMatrix(
        coords.x * revolutions(1 / 15)
      , revolutions(1 / 19)
      , coords.y * revolutions(1 / 15)
      )

      object.setRotationFromMatrix(r)

      scene.add(object)
    }
  }

  function rotationMatrix(x, y, z) {
    var rx = new THREE.Matrix4()
      , ry = new THREE.Matrix4()
      , rz = new THREE.Matrix4()
      , r = new THREE.Matrix4()

    rx.makeRotationX(x)
    ry.makeRotationY(y)
    rz.makeRotationZ(z)

    r.multiplyMatrices(rx, ry)
    r.multiply(rz)

    return r
  }

  function getRenderer() {
    var r = new THREE.WebGLRenderer()
    r.setSize(500, 500)
    return r
  }

  function getCamera(viewSize) {
    var aspectRatio = 1
      , nearFar = viewSize

    return new THREE.OrthographicCamera(
          -aspectRatio * viewSize / 2
        , aspectRatio * viewSize / 2
        , viewSize / 2
        , -viewSize / 2
        , -nearFar
        , nearFar
        )
  }

  function getObject(size) {
    return THREE.SceneUtils.createMultiMaterialObject(
        getGeometry(size)
      , getMaterials()
      )
  }

  function getMaterials() {
    var fill = new THREE.MeshBasicMaterial({
          vertexColors: THREE.VertexColors
      })
      , stroke = new THREE.MeshBasicMaterial({
          color: 0
        , wireframe: true
        , transparent: true
      })
    return [ fill, stroke ]
  }

  function getGeometry(size) {
    var geometry = new THREE.Geometry()
      , red1 = 0xe52c21
      , red2 = 0xfb5220
      , yellow1 = 0xffea00
      , yellow2 = 0xfdb70f
      , purple = 0x5e207e
      , cyan = 0x0feada
      , green = 0x52e988
      , x = size * 0.8
      , y = size * 1
      , z = size * 0.8

    geometry.vertices.push(
        new THREE.Vector3(-x, 0, z)
      , new THREE.Vector3(x, 0, z)
      , new THREE.Vector3(0, y, 0)
      , new THREE.Vector3(x, 0, -z)
      , new THREE.Vector3(-x, 0, -z)
      , new THREE.Vector3(0, -y, 0)
      )

    geometry.faces.push(
        getFace(0, 1, 2, red1)
      , getFace(0, 5, 1, red2)
      , getFace(1, 3, 2, purple)
      , getFace(1, 5, 3, cyan)
      , getFace(2, 3, 4, cyan)
      , getFace(4, 3, 5, green)
      , getFace(0, 2, 4, yellow1)
      , getFace(0, 4, 5, yellow2)
      )

    return geometry
  }

  function getFace(v1, v2, v3, color) {
    var face = new THREE.Face3(v1, v2, v3)
    face.color.setHex(color)
    return face
  }

  function getGrid(rows, cols) {

    return { getCoords: getCoords }

    function getCoords(n) {
      return {
          x: n % cols
        , y: Math.floor(n / cols)
      }
    }
  }

  function getStats() {
    var stats = new Stats()
    stats.setMode(0)
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.right = 0
    stats.domElement.style.top = 0
    return stats
  }

})()
