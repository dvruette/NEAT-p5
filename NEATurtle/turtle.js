function Turtle(x, y, dna) {
  this.x = x || 0
  this.y = y || 0
  this.origin = { x, y }
  this.energy = 200
  this.steps = 0
  this.alive = true
  this.diedInLava = false
  this.viewingDistance = 7
  this.fieldOfView = this.viewingDistance*this.viewingDistance
  this.actionSpace = 8
  this.dna = dna || new DNA(null, this.fieldOfView, this.actionSpace)
  this.brain = new Brain(this.dna)

  this.fitness = function() {
    return this.steps / (this.diedInLava ? 2 : 1)
  }

  this.update = function(environment) {
    if (!this.alive) return

    let fov = [], noise = 0.015
    for (let y = 0; y < this.viewingDistance; y++) {
      for (let x = 0; x < this.viewingDistance; x++) {
        let cx = this.x-2 + x, cy = this.y-2 + y
        if (cx < 2 || cx >= res.x-2 || cy < 2 || cy >= res.y-2) fov.push(-1)
        else fov.push(environment[cx][cy] + random(-noise/2, noise/2))
      }
    }

    const action = this.brain.evaluate(fov)
    if (action == 0 || action == 5 || action == 8) this.y++
    if (action == 1 || action == 6 || action == 7) this.y--
    if (action == 2 || action == 7 || action == 8) this.x--
    if (action == 3 || action == 5 || action == 6) this.x++
    this.steps++

    if (this.x >= 2 && this.x < res.x-2 && this.y >= 2 && this.y < res.y-2) {
      if (environment[this.x][this.y] < 0) {
        this.energy -= 30
        if (this.energy <= 0) this.diedInLava = true
      } else {
        this.energy--
        this.energy += environment[this.x][this.y]
                     + 0.4*environment[this.x+1][this.y]
                     + 0.4*environment[this.x][this.y+1]
                     + 0.4*environment[this.x-1][this.y]
                     + 0.4*environment[this.x][this.y-1]
                     + 0.2*environment[this.x+2][  this.y]
                     + 0.2*environment[this.x+1][this.y+1]
                     + 0.2*environment[  this.x][this.y+2]
                     + 0.2*environment[this.x-1][this.y+1]
                     + 0.2*environment[this.x-2][  this.y]
                     + 0.2*environment[this.x-1][this.y-1]
                     + 0.2*environment[  this.x][this.y-2]
                     + 0.2*environment[this.x+1][this.y-1]

        environment[this.x][this.y] *= 0.8
        environment[this.x+1][this.y] *= 0.85
        environment[this.x-1][this.y] *= 0.85
        environment[this.x][this.y+1] *= 0.85
        environment[this.x][this.y-1] *= 0.85
        environment[this.x+2][  this.y] *= 0.9
        environment[this.x+1][this.y+1] *= 0.9
        environment[  this.x][this.y+2] *= 0.9
        environment[this.x-1][this.y+1] *= 0.9
        environment[this.x-2][  this.y] *= 0.9
        environment[this.x-1][this.y-1] *= 0.9
        environment[  this.x][this.y-2] *= 0.9
        environment[this.x+1][this.y-1] *= 0.9
      }
    } else {
      this.energy = -50
    }

    if (this.energy <= 0) this.alive = false
  }

  this.show = function() {
    if (this.alive) {
      fill(255)
      stroke(0)
      ellipse(this.x*scale, this.y*scale, 5, 5)
    } else {
      fill(color(0, 0, 255))
      stroke(color(0, 200, 200))
      rectMode(CENTER)
      rect(this.x*scale, this.y*scale, 2, 2)
    }
  }
}
