const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

// type List a = Nil | Cons a (List a)
const List = daggy.taggedSum({
  Cons: ['x', 'xs'],
  Nil: [],
})

// instance Setoid a => Setoid (List a) where
//   equals :: List a ~> List a -> Boolean
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

// instance Semigroup List where
//   concat :: List a ~> List a -> List a
List.prototype.concat = function(ys) {
  if (Q.isEmpty(ys)) {
    return this
  }
  return this.cata({
    Nil: () => ys,
    Cons: (x, xs) => List.Cons(x, xs[fl.concat](ys)),
  })
}

// instance Monoid List where
//   empty :: List a
List.empty = List.Nil

List.prototype.toString = function() {
  return this.cata({
    Nil: () => 'Nil',
    Cons: (x, xs) => 'Cons(' + x + ',' + xs + ')',
  })
}

List.fromArray = (arr) => arr.reduceRight((acc, a) => List.Cons(a, acc), List.Nil)

flPatch(List)

module.exports = List
