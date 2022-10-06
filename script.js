let simplex = new SimplexNoise(868);

let c = document.getElementById('canvas')
let ctx = c.getContext('2d')

function resized() {
  if (window.innerWidth > window.innerHeight) {
    c.height = window.innerHeight * 0.9
    c.width = window.innerHeight * 0.9
  } else {
    c.height = window.innerWidth * 0.9
    c.width = window.innerWidth * 0.9
  }
  ctx.translate(c.width/2, c.height/2)
}
addEventListener('resize',resized)
c.addEventListener('mousemove', (e) => {
  // ctx.fillRect(e.clientX)
  var rect = e.target.getBoundingClientRect();
  mouse.x = e.clientX - (rect.left + c.width/2); //x position within the element.
  mouse.y = e.clientY - (rect.top + c.height/2);  //y position within the element.
})
ctx.translate(c.width/2, c.height/2)
resized()

let mouse = {
  x: 0,
  y: 0
}

class Particle {
  constructor (cfg) {
    this.x = (cfg.x || 0)
    this.y = (cfg.y || 0)
    this.size = (cfg.size || 5)
    this.pushDist = 100

    this.xVel = 0;
    this.yVel = 0
  }
  update () {
    this.mouseDist = Math.sqrt((mouse.x - this.x)**2 + (mouse.y - this.y)**2)
    // console.log(this.mouseDist)
    let angle = Math.atan2(mouse.x - this.x, mouse.y - this.y)

    if (this.mouseDist < this.pushDist){
      this.grav = ((this.pushDist / 50) - (this.mouseDist / 100)) / 5
      this.xVel += Math.max(-Math.sin(angle) * this.grav) / 5
      this.yVel += Math.max(-Math.cos(angle) * this.grav) / 5
    }
    if (this.xVel != 0 && this.yVel != 0){
      debugInfo.updates+=1

      this.xVel *= 0.99
      this.yVel *= 0.99

      this.xVel = Math.round(this.xVel * 100) / 100
      this.yVel = Math.round(this.yVel * 100) / 100
      // this.grav = Math.max(this.grav, 0)
      // console.log(this.xVel)


      this.x += this.xVel
      this.y += this.yVel

      if (this.x >= c.width / 2) {
        this.x = -c.width / 2 + 1
      }
      if (this.x <= -c.width / 2){
        this.x = c.width / 2 - 1
      }
      if (this.y >= c.height / 2) {
        this.y = -c.height / 2 + 1
      }
      if (this.y <= -c.height / 2){
        this.y = c.height / 2 - 1
      }
    }
    this.draw()
  }
  draw () {
    ctx.fillStyle = `hsl(${(Math.abs(this.xVel) + Math.abs(this.yVel)) * 20},70%,70%)`
    // console.log((this.xVel + this.yVel) / 2)
    // ctx.fillStyle = `hsl(${20},70%,70%)`
    ctx.fillRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size)
  }
}

let p = []

// for (let i = 0; i < 4000; i++){
//   p[i] = new Particle({
//     x: ((Math.random() * 2) - 1) * 100,
//     y: ((Math.random() * 2) - 1) * 100
//   })
// }


let detail = 6
for (let i = 0; i < c.width / detail; i++){
  for (let j = 0; j < c.height / detail; j++){
    p[p.length] = new Particle({
      x: i * detail - (c.width / 2),
      y: j * detail - (c.height / 2),
      size: detail
    })
  }
}

// let p = new Particle({})
let frameStart = performance.now()

let debugInfo = {

}

function tick() {
  document.getElementById('debug').innerHTML = `
    ${Math.round(1000 / ((performance.now() - frameStart)))}FPS <br>
    ${debugInfo.updates} Updates per frame <br>
    ${p.length} Particles
  `
  debugInfo.updates = 0
  frameStart = performance.now()
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fillRect(-c.width, -c.height, c.width * 2, c.height * 2)
  for (let i of p){
    i.update()
  }
  requestAnimationFrame(tick)
  // setInterval(tick, 1)
}
tick()
// setInterval(tick, 5)
