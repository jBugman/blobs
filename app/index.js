import 'normalize.css'
import * as PIXI from 'pixi.js'
import mousePosition from 'mouse-position'
import {use as matterPlugin, Engine, Bodies, World, Body, Vector} from 'matter-js'
import 'matter-collision-events'

matterPlugin('matter-collision-events')

const PLAYER_COLOR = 0x23a031
const PLAYER_BORDER = 0x124f18
const BLUE_COLOR = 0x429bf4
const BLUE_BORDER = 0x2e6caa

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
var mobs = []

const wall1 = Bodies.rectangle(app.screen.width / 2, app.screen.height, app.screen.width, 10, {isStatic: true, label: 'wall1'})
const wall2 = Bodies.rectangle(app.screen.width / 2, -5, app.screen.width, 10, {isStatic: true, label: 'wall2'})
const wall3 = Bodies.rectangle(-5, app.screen.height / 2, 10, app.screen.height, {isStatic: true, label: 'wall3'})
const wall4 = Bodies.rectangle(app.screen.width, app.screen.height / 2, 10, app.screen.height, {isStatic: true, label: 'wall4'})
bodies.push(wall1, wall2, wall3, wall4)

var blobCount = 0

function newBlob (isPlayer, radius, position) {
  const blob = new PIXI.Graphics()
  blob.radius = radius
  blob.beginFill(isPlayer ? PLAYER_COLOR : BLUE_COLOR)
  blob.lineStyle(2, isPlayer ? PLAYER_BORDER : BLUE_BORDER, 1)
  blob.drawCircle(0, 0, blob.radius)
  blob.endFill()
  app.stage.addChild(blob)
  blob.interactive = isPlayer
  blob.body = Bodies.circle(position.x, position.y, blob.radius)
  blob.body.label = isPlayer ? 'player' : blobCount++
  blob.body.frictionAir = 0
  bodies.push(blob.body)
  mobs.push(blob)
  blob.body.onCollide(function (collision) {
    console.log('collision', collision)
    var v = blob.body.velocity
    if (collision.bodyA === wall1 || collision.bodyA === wall2) {
      v.y = -v.y
      Body.setVelocity(blob.body, v)
    } else
    if (collision.bodyA === wall3 || collision.bodyA === wall4) {
      Body.setVelocity(blob.body, {x: -v.x, y: v.y})
    }
  })
  return blob
}

const player = newBlob(true, 50, {x: app.screen.width / 2, y: app.screen.height / 2})

var blobs = []
blobs.push(newBlob(false, 30, {x: app.screen.width * 0.33, y: app.screen.height * 0.33}))
blobs.push(newBlob(false, 10, {x: app.screen.width * 0.4, y: app.screen.height * 0.66}))
blobs.push(newBlob(false, 25, {x: app.screen.width * 0.8, y: app.screen.height * 0.2}))

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
  // rendering each body in place of its physics body
  mobs.forEach(function (mob) {
    mob.position = mob.body.position
  })
  app.renderer.render(app.stage)
}

gameLoop()
World.add(engine.world, bodies)
Engine.run(engine)
