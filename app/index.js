import 'normalize.css'
import * as PIXI from 'pixi.js'
import mousePosition from 'mouse-position'
import Victor from 'victor'

var type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}
PIXI.utils.sayHello(type)

var mouse = mousePosition()

var renderer = PIXI.autoDetectRenderer(256, 256)
document.body.appendChild(renderer.view)
renderer.backgroundColor = 0xffffff
renderer.view.style.position = 'absolute'
renderer.view.style.display = 'block'
renderer.autoResize = true
renderer.resize(window.innerWidth, window.innerHeight)

var stage = new PIXI.Container()
stage.interactive = true
stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight)

var player = new PIXI.Graphics()
player.beginFill(0x429bf4)
player.lineStyle(4, 0x2e6caa, 1)
player.drawCircle(0, 0, 50)
player.v = new Victor(0, 0)
player.endFill()
player.interactive = true
player.position.x = window.innerWidth / 2
player.position.y = window.innerHeight / 2
stage.addChild(player)

stage.on('click', function (event) {
  if (event.target === player) {
    event.stopPropagation()
    return
  }
  // relative click direction -> speed vector
  player.v = new Victor(mouse[0] - player.x, mouse[1] - player.y).normalize()
})

function gameLoop () {
  window.requestAnimationFrame(gameLoop)

  player.x += player.v.x
  player.y += player.v.y

  renderer.render(stage)
}

gameLoop()
