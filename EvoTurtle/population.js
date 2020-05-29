
function Population() {
  this.turtles = []
  this.popsize = 100
  this.alive = true

  for (let i = 0; i < this.popsize; i++) {
    let x, y
    do {
      x = floor(random(environment.length))
      y = floor(random(environment[0].length))
    } while (environment[x][y] == -1)

    this.turtles.push(new Turtle(x, y))
  }

  this.evolve = function() {
    let max_fit = 0
    let avg_fitness = 0
    let matingpool = []
    let newTurtles = []


    for (let turtle of this.turtles) {
      let fitness = turtle.fitness()
      avg_fitness += fitness
      if (fitness > max_fit) max_fit = fitness
    }
    avg_fitness /= this.turtles.length
    fitnessP.html('Max fitness: '+max_fit.toFixed(2)+' (avg. '+avg_fitness.toFixed(2)+')')

    for (let turtle of this.turtles) {
      let n = turtle.fitness() / max_fit * 100
      for (let i = 0; i < n; i++) matingpool.push(turtle)
    }

    for (let i = 0; i < this.turtles.length; i++) {
      let genomeA = random(matingpool).dna
      let genomeB = random(matingpool).dna
      let childDNA = genomeA.crossover(genomeB)
      childDNA.mutate()

      let x, y
      do {
        x = floor(random(environment.length))
        y = floor(random(environment[0].length))
      } while (environment[x][y] == -1)
      newTurtles.push(new Turtle(x, y, childDNA))
    }

    this.turtles = newTurtles

  }

  this.update = function() {
    let alive = false
    for (turtle of this.turtles) {
      turtle.update(environment)
      alive |= turtle.alive
    }
    this.alive = alive
  }

  this.show = function() {
    for (turtle of this.turtles) turtle.show()
  }
}
