let population = null
let environment = []
let img
let scale = 1
let res = {
  x: 720,
  y: 480
}

let fitnessP
let cycle = 0
const EPOQUE = 1000
let SPEED = 10


function setup() {
  createCanvas(res.x*scale, res.y*scale)
  fitnessP = createP()

  img = createImage(res.x, res.y)
  img.loadPixels()
  for (let x = 0; x < res.x; x++) {
    environment[x] = []
    for (let y = 0; y < res.y; y++) {
      let off = 0.04
      let cutoff = 0.35
      let n = noise(x*off, y*off)
      if (n < cutoff) n = -1
      else {
        n = (n - cutoff) / (0.95 - cutoff)
        let d = 20
        if (x < d) n *= x/d
        if (y < d) n *= y/d
        if (x > width - d) n *= (width - x)/d
        if (y > height - d) n *= (height - y)/d
      }
      environment[x][y] = n
      if (n == -1) img.set(x, y, color(250, 50, 40))
      else img.set(x, y, n*255)
    }
  }
  img.updatePixels()

  population = new Population()
}

function draw() {
  // background (0)
  image(img, 0, 0)
  for (let i = 0; i < SPEED; i++) {
    population.update()
    cycle++
  }
  population.show()

  if (!population.alive) {
    population.evolve()
    cycle = 0
  }
}
