import 'normalize.css'
// import {utils, autoDetectRenderer, Container} from 'pixi.js'
import * as PIXI from 'pixi.js'

var type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}
PIXI.utils.sayHello(type)

var renderer = PIXI.autoDetectRenderer(256, 256)
document.body.appendChild(renderer.view)
renderer.backgroundColor = 0xffffff
renderer.view.style.position = 'absolute'
renderer.view.style.display = 'block'
renderer.autoResize = true
renderer.resize(window.innerWidth, window.innerHeight)

var stage = new PIXI.Container()
renderer.render(stage)
