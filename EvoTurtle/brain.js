
function Brain(dna, num_actions) {
  this.dna = dna || new DNA()
  this.actionSpace = num_actions

  // field of view (fov) is an array containing all visible (to the turtle) pixels
  this.evaluate = function(fov) {
    let actions = []
    for (let i = 0; i < this.actionSpace; i++) {
      actions[i] = random(-1, 1) * this.dna.genes[i * (fov.length + 2)]
      for (let j = 2; j < fov.length + 2; j++) {
        let pixel = 1
        if (j < fov.length) pixel = fov[j]
        actions[i] += pixel * this.dna.genes[i * (fov.length + 2) + j]
      }
    }

    let max = -10000, index = -1
    for (let i = 0; i < actions.length; i++) {
      if (actions[i] > max) {
        max = actions[i]
        index = i
      }
    }
    // console.log(actions)
    // console.log(fov)
    return index
  }
}
