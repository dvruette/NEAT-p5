
function DNA(length, genes) {
  this.genes = genes || []
  if (!genes) {
    for (let i = 0; i < length; i++) {
      this.genes.push(random(-1, 1))
    }
  }

  this.crossover = function(partner) {
    let genes = []
    let mid = floor(random(this.genes.length))
    for (let i = 0; i < this.genes.length; i++) {
      if (i < mid && i < partner.genes.length) genes[i] = partner.genes[i]
      else genes[i] = this.genes[i]
    }

    return new DNA(genes.length, genes)
  }

  this.mutate = function() {
    for (let i = 0; i < this.genes.length; i++) {
      if (random() < 0.01) this.genes[i] = random(-1, 1)
    }
  }
}
