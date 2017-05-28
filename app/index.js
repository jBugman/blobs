import 'normalize.css'
import * as PIXI from 'pixi.js'
import mousePosition from 'mouse-position'
import Victor from 'victor'

const mouse = mousePosition()

const app = new PIXI.Application()
app.renderer.backgroundColor = 0xffffff
app.view.style.position = 'absolute'
app.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)
document.body.appendChild(app.view)

app.stage.interactive = true
app.stage.hitArea = app.screen

const player = new PIXI.Graphics()
player.beginFill(0x429bf4)
player.lineStyle(4, 0x2e6caa, 1)
player.drawCircle(0, 0, 50)
player.v = new Victor(0, 0)
player.endFill()
player.interactive = true
player.position.x = app.screen.width / 2
player.position.y = app.screen.height / 2
app.stage.addChild(player)

app.stage.on('click', function (event) {
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

  app.renderer.render(app.stage)
}

gameLoop()
