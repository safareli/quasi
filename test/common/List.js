const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const fl = require('../../src/fl.js')

const List = daggy.taggedSum({
  Cons: ['x', 'xs'],
  Nil: [],
})

List.prototype.toString = function() {
  return this.cata({
    Nil: () => 'Nil',
    Cons: (x, xs) => 'Cons(' + x + ',' + xs + ')',
  })
}

List.prototype[fl.equals] = function(b) {
  return this.cata({
    Nil: () => b.cata({
      Nil: () => true,
      Cons: (x, xs) => false,
    }),
    Cons: (x, xs) => b.cata({
      Nil: () => false,
      Cons: (y, ys) => (x === y || x[fl.equals](y)) && xs[fl.equals](ys),
    }),
  })
}

List.prototype[fl.concat] = function(ys) {
  if (Q.isEmpty(ys)) {
    return this
  }
  return this.cata({
    Nil: () => ys,
    Cons: (x, xs) => List.Cons(x, xs[fl.concat](ys)),
  })
}

List.fromArray = (arr) => arr.reduceRight((acc, a) => List.Cons(a, acc), List.Nil)

module.exports = List
