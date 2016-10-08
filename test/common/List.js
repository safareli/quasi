const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

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

List.prototype.equals = function(b) {
  return this.cata({
    Nil: () => b.cata({
      Nil: () => true,
      Cons: (x, xs) => false,
    }),
    Cons: (x, xs) => b.cata({
      Nil: () => false,
      Cons: (y, ys) => equals(x, y) && xs[fl.equals](ys),
    }),
  })
}

List.prototype.concat = function(ys) {
  if (Q.isEmpty(ys)) {
    return this
  }
  return this.cata({
    Nil: () => ys,
    Cons: (x, xs) => List.Cons(x, xs[fl.concat](ys)),
  })
}

List.fromArray = (arr) => arr.reduceRight((acc, a) => List.Cons(a, acc), List.Nil)

flPatch(List)

module.exports = List
