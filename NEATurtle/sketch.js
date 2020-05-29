let population = null
let environment = []
let terrain = []
let img
let scale = 1
let res = {
  x: 600,
  y: 400
}

let fitnessP
let generationP
let speciesP
let cycle = 0
let generation = 0
let SPEED = 1000
let ANIMATE = true


function setup() {
  createCanvas(res.x*scale, res.y*scale)
  fitnessP = createP()
  generationP = createP()
  speciesP = createP()

  img = createImage(res.x, res.y)
  img.loadPixels()
  for (let x = 0; x < res.x; x++) {
    terrain[x] = []
    for (let y = 0; y < res.y; y++) {
      let off = 0.04
      let cutoff = 0.32
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
      terrain[x][y] = n
      if (n == -1) img.set(x, y, color(250, 50, 40))
      else img.set(x, y, n*255)
    }
  }
  img.updatePixels()

  for (i in terrain) {
    environment[i] = terrain[i].slice()
  }
  population = new Population(100)
}

function draw() {
  if (SPEED <= 3) {
    loadPixels()
    for (let x = 0; x < res.x; x++) {
      for (let y = 0; y < res.y; y++) {
        let n = environment[x][y]
        if (n == -1) set(x, y, color(250, 50, 40))
        else set(x, y, n*255)
      }
    }
    updatePixels()
  } else {
    image(img, 0, 0)
  }

  for (let i = 0; i < SPEED && population.alive; i++) {
    population.update()
    cycle++
  }
  if (ANIMATE) population.show()

  if (!population.alive) {
    population.evolve()
    for (i in terrain) environment[i] = terrain[i].slice()
    cycle = 0
    generation++
    generationP.html('Generation: '+generation)
  }
}
