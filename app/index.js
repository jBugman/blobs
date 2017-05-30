import 'normalize.css'
import * as PIXI from 'pixi.js'
import mousePosition from 'mouse-position'
import {use as matterPlugin, Engine, Bodies, World, Body, Vector} from 'matter-js'
import 'matter-collision-events'

matterPlugin('matter-collision-events')

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

const engine = Engine.create()
engine.world.gravity.y = 0
var bodies = []

const wall1 = Bodies.rectangle(app.screen.width / 2, app.screen.height, app.screen.width, 10, {isStatic: true, label: 'wall1'})
const wall2 = Bodies.rectangle(app.screen.width / 2, -5, app.screen.width, 10, {isStatic: true, label: 'wall2'})
const wall3 = Bodies.rectangle(-5, app.screen.height / 2, 10, app.screen.height, {isStatic: true, label: 'wall3'})
const wall4 = Bodies.rectangle(app.screen.width, app.screen.height / 2, 10, app.screen.height, {isStatic: true, label: 'wall4'})
bodies.push(wall1, wall2, wall3, wall4)

const player = new PIXI.Graphics()
player.radius = 50
player.beginFill(0x429bf4)
player.lineStyle(4, 0x2e6caa, 1)
player.drawCircle(0, 0, player.radius)
player.endFill()
app.stage.addChild(player)
player.interactive = true
player.body = Bodies.circle(app.screen.width / 2, app.screen.height / 2, player.radius)
player.body.label = 'player'
player.body.frictionAir = 0
bodies.push(player.body)

player.body.onCollide(function (collision) {
  console.log('collision', collision)
  var v = player.body.velocity
  if (collision.bodyA === wall1 || collision.bodyA === wall2) {
    v.y = -v.y
    Body.setVelocity(player.body, v)
  } else
  if (collision.bodyA === wall3 || collision.bodyA === wall4) {
    Body.setVelocity(player.body, {x: -v.x, y: v.y})
  }
})

app.stage.on('click', function (event) {
  if (event.target === player) {
    event.stopPropagation()
    return
  }
  // relative click direction -> speed vector
  var v = Vector.create(mouse[0] - player.x, mouse[1] - player.y)
  Body.setVelocity(player.body, Vector.normalise(v))
})

function gameLoop () {
  window.requestAnimationFrame(gameLoop)

  player.position = player.body.position

  app.renderer.render(app.stage)
}

gameLoop()
World.add(engine.world, bodies)
Engine.run(engine)
