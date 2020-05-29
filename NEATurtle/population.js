
function Population(popsize) {
  this.turtles = []
  this.popsize = popsize || 100
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
    let total_fitness = 0
    let species = []
    let newTurtles = []

    for (let turtle of this.turtles) {
      let fitness = turtle.fitness()
      turtle.fitness = fitness
      total_fitness += fitness
      if (fitness > max_fit) max_fit = fitness
    }
    avg_fitness = total_fitness / this.turtles.length
    fitnessP.html('Max fitness: '+max_fit.toFixed(2)+' (avg. '+avg_fitness.toFixed(2)+')')

    for (let turtle of this.turtles) {
      let threshold = 3.3
      let minDistance = 10000, closestSpecies
      for (let spec of species) {
        let dist = turtle.dna.distance(random(spec.members).dna)
        if (dist < minDistance) {
          minDistance = dist
          closestSpecies = spec
        }
      }
      if (minDistance < threshold) {
        closestSpecies.members.push(turtle)
        closestSpecies.totalFitness += turtle.fitness
      } else {
        species.push({ members: [turtle], totalFitness: turtle.fitness })
      }
    }
    speciesP.html('Species: '+species.length)

    let totalAdjustedFitness = 0
    for (let spec of species) {
      spec.adjustedFitness = spec.totalFitness / spec.members.length
      totalAdjustedFitness += spec.adjustedFitness
    }
    for (let spec of species) {
      let offspring = spec.adjustedFitness / totalAdjustedFitness * this.popsize
      for (let i = 0; i < offspring; i++) {
        let parentA, parentB, fitnessPointer = 0
        let randA = random(0, spec.totalFitness), randB = random(0, spec.totalFitness)
        for (let j = 0; (!parentA || !parentB) && j < spec.members.length; j++) {
          let turtle = spec.members[j]
          fitnessPointer += turtle.fitness
          if (randA < fitnessPointer && !parentA) parentA = turtle
          if (randB < fitnessPointer && !parentB) parentB = turtle
        }
        let childDna = parentA.dna.crossover(parentB.dna, parentA.fitness, parentB.fitness)
        childDna.mutate()

        let x, y
        do {
          x = floor(random(environment.length))
          y = floor(random(environment[0].length))
        } while (environment[x][y] < 0)
        newTurtles.push(new Turtle(x, y, childDna))
      }
    }

    // for (let i = 0; i < this.popsize; i++) {
    //   let parentA, parentB, fitnessPointer = 0
    //   let randA = random(0, total_fitness), randB = random(0, total_fitness)
    //   for (let i = 0; (!parentA || !parentB) && i < this.turtles.length; i++) {
    //     let turtle = this.turtles[i]
    //     fitnessPointer += turtle.fitness
    //     if (randA < fitnessPointer && !parentA) parentA = turtle
    //     if (randB < fitnessPointer && !parentB) parentB = turtle
    //   }
    //   let childDna = parentA.dna.crossover(parentB.dna, parentA.fitness, parentB.fitness)
    //   childDna.mutate()
    //
    //   let x, y
    //   do {
    //     x = floor(random(environment.length))
    //     y = floor(random(environment[0].length))
    //   } while (environment[x][y] < 0)
    //   newTurtles.push(new Turtle(x, y, childDna))
    // }

    this.turtles = newTurtles
    this.alive = true
  }

  this.update = function() {
    let alive = 0
    for (turtle of this.turtles) {
      turtle.update(environment)
      alive += turtle.alive ? 1 : 0
    }
    this.alive = alive
  }

  this.show = function() {
    for (turtle of this.turtles) turtle.show()
  }
}
