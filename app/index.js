import {utils} from 'pixi.js'

var type = 'WebGL'
if (!utils.isWebGLSupported()) {
  type = 'canvas'
}

utils.sayHello(type)
