
let _innovationCounter = 0
function DNA(genome, n_inputs, n_outputs) {
  this._nodeCounter = 0
  if (genome) this.genome = genome
  else {
    this.genome = {
      inputNodes: [],
      outputNodes: [],
      hiddenNodes: [],
      connections: []
    }

    for (let i = 0; i < n_inputs; i++) {
      this.genome.inputNodes.push(this._nodeCounter++)
    }
    for (let i = 0; i < n_outputs; i++) {
      this.genome.outputNodes.push(this._nodeCounter++)
    }

    let input = random(this.genome.inputNodes)
    let output = random(this.genome.outputNodes)
    this.genome.connections.push({
      in: input,
      out: output,
      weight: random(-2, 2),
      bias: random(-2, 2),
      enabled: true,
      innovation: _innovationCounter++
    })
  }

  this.mutate = function() {
    let mutationRate = 0.1
    let connectionMutationRate = 0.02
    // mutate add node
    let rand = random()
    if (rand < mutationRate) {
      const connections = this.genome.connections
      let connection = random(connections)
      let node = this._nodeCounter++
      let input = Object.assign({}, connection)
      let out = Object.assign({}, connection)
      Object.assign(input, { out: node, innovation: _innovationCounter++ })
      Object.assign(out, { in: node, innovation: _innovationCounter++ })

      let index = connections.indexOf(connection)
      connections.splice(index, 1)
      connections.push(input, out)
      this.genome.hiddenNodes.push(node)
    }
    // mutate add connection
    else if (rand < 2*mutationRate) {
      let input, out, exists, maxIter = 0
      do {
        input = random(this.genome.inputNodes.concat(this.genome.hiddenNodes))
        out = random(this.genome.outputNodes.concat(this.genome.hiddenNodes))
        exists = this.genome.connections.find(c => c.in == input && c.out == out)
        maxIter++
      } while (exists && maxIter < this._nodeCounter)
      if (exists) return

      const connection = {
        in: input,
        out,
        weight: random(-2, 2),
        bias: random(-2, 2),
        enabled: true,
        innovation: _innovationCounter++
      }
      this.genome.connections.push(connection)
    }
    // mutate toggle connection
    else if (rand < 3*mutationRate) {
      let connection = random(this.genome.connections)
      connection.enabled = !connection.enabled
    }

    // mutate connection
    for (connection of this.genome.connections) {
      if (random() < connectionMutationRate) {
        let mutation = random(0, 2)
        if (mutation < 1) {
          connection.weight += random(-0.5, 0.5)
          connection.bias += random(-0.5, 0.5)
        } else {
          connection.weight = random(-2, 2)
          connection.bias = random(-2, 2)
        }
      }
    }

  }

  this.crossover = function(partner, selfFitness, partnerFitness) {
    const selfConnections = this.genome.connections
    const partnerConnections = partner.genome.connections
    const fitConnections = selfFitness > partnerFitness ? selfConnections : partnerConnections
    const unfitConnections = selfFitness > partnerFitness ? partnerConnections : selfConnections
    let connections = fitConnections.map(c => Object.assign({}, c))
    let fitnessRatio = partnerFitness / (selfFitness + partnerFitness)

    for (let connection of partner.genome.connections) {
      let i = connections.findIndex(c => c.innovation = connection.innovation)
      if (i >= 0) {
        if (random() < fitnessRatio) connections.splice(i, 1, Object.assign({}, connection))
      } else connections.push(Object.assign({}, connection))
    }

    let hiddenNodes = this.genome.hiddenNodes.slice()
    for (let node of partner.genome.hiddenNodes) {
      if (!hiddenNodes.includes(node)) hiddenNodes.push(node)
    }

    return new DNA({
      inputNodes: this.genome.inputNodes.slice(),
      outputNodes: this.genome.outputNodes.slice(),
      hiddenNodes,
      connections
    })
  }

  this.distance = function(other) {
    let ownConnections = this.genome.connections, otherConnections = other.genome.connections
    let commonGenes = 0, distance = 0, weightDiff = 0
    for (let con of ownConnections) {
      otherCon = otherConnections.find(c => c.innovation == con.innovation)
      if (otherCon) {
        commonGenes++
        weightDiff += abs(con.weight - otherCon.weight) + abs(con.bias - otherCon.bias)
      }
    }
    if (commonGenes > 0) weightDiff /= commonGenes
    distance = (ownConnections.length - commonGenes) + (otherConnections.length - commonGenes)
    distance /= max(ownConnections.length, otherConnections.length)
    return 2*distance + weightDiff
  }

}
