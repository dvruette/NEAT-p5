

function Brain(dna, n_inputs, n_outputs) {
  this.dna = dna || new DNA(null, n_inputs, n_outputs)


  this.evaluate = function(perception) {
    const connections = this.dna.genome.connections
    const inputNodes = this.dna.genome.inputNodes
    const hiddenNodes = this.dna.genome.hiddenNodes

    let outputs = []
    for (let outputNode of this.dna.genome.outputNodes) {
      outputs.push(backpropagate(outputNode))
    }

    let max = 0, action = -1
    for (let i in outputs) {
      if (outputs[i] > max) {
        max = outputs[i]
        action = i
      }
    }

    return action

    function backpropagate(node) {
      let input = inputNodes.indexOf(node)
      if (input >= 0) return perception[input]
      else {
        let sum = 0
        let cons = connections.filter(con => con.out == node && con.enabled)
        for (let con of cons) {
          sum += con.weight * backpropagate(con.in) + con.bias
        }
        return sigmoid(sum)
      }
    }

    function sigmoid(x) {
      return 1 / (1 + Math.exp(-x))
    }
  }
}
