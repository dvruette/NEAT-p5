function Turtle(x, y, dna) {
  this.x = x || 0
  this.y = y || 0
  this.origin = { x, y }
  this.energy = 200
  this.steps = 0
  this.alive = true
  this.viewingDistance = 5
  this.actionSpace = 4
  this.dna = dna || new DNA(this.actionSpace * (this.viewingDistance*this.viewingDistance + 2))
  this.brain = new Brain(this.dna, this.actionSpace)

  this.fitness = function() {
    return (this.steps*this.steps)/1000
  }

  this.update = function(environment) {
    this.energy--
    if (this.x < 0 || this.x >= res.x || this.y < 0 || this.y >= res.y) this.energy = -50
    else if (environment[this.x][this.y] == -1) this.energy -= 30
    if (this.energy <= 0) this.alive = false
    if (!this.alive) return

    let fov = []
    for (let y = 0; y < this.viewingDistance; y++) {
      for (let x = 0; x < this.viewingDistance; x++) {
        let cx = this.x-2 + x, cy = this.y-2 + y
        if (cx < 0 || cx >= res.x || cy < 0 || cy >= res.y) fov.push(-1)
        else fov.push(environment[cx][cy])
      }
    }

    this.energy += environment[this.x][this.y]

    const action = this.brain.evaluate(fov)
    if (action == 0) this.y++
    else if (action == 1) this.y--
    else if (action == 2) this.x--
    else if (action == 3) this.x++
    else return
    this.steps++
  }

  this.show = function() {
    if (this.alive) {
      fill(255)
      stroke(0)
      ellipse(this.x*scale, this.y*scale, 5, 5)
    } else {
      fill(color(0, 0, 255))
      stroke(color(0, 200, 200))
      rect(this.x*scale, this.y*scale, 2, 2)
    }
  }
}
