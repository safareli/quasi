const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

// type Pair a b = Pair a b
const Pair = daggy.tagged('_1', '_2')

// instance (Setoid a, Setoid b) => Setoid (Pair a b) where
//   empty :: Pair a b ~> Pair a b -> Boolean
Pair.prototype.equals = function(b) {
  return equals(this._1, b._1) && equals(this._2, b._2)
}

// instance (Semigroup a, Semigroup b) => Semigroup (Pair a b) where
//   concat :: Pair a b ~> Pair a b -> Pair a b
Pair.prototype.concat = function(b) {
  if (Q.isEmpty(this._1) || Q.isEmpty(this._2)) {
    return b
  } else if (Q.isEmpty(b) || Q.isEmpty(b._1) || Q.isEmpty(b._2)) {
    return this
  } else {
    return Pair(this._1[fl.concat](b._1), this._2[fl.concat](b._2))
  }
}

// instance (Monoid a, Monoid b) => Monoid (Pair a b) where
//   empty :: Pair a b
Pair.empty = Pair(Q.empty, Q.empty)

// instance Functor (Pair a) where
//   map :: Pair a b ~> (b -> c) -> Pair a c
Pair.prototype.map = function(f) {
  return Pair(this._1, f(this._2))
}

// instance (Monoid a) => Apply (Pair a) where
//   ap :: Pair a b ~> Pair a (b -> c) -> Pair a c
Pair.prototype.ap = function(f) {
  const b = Q.foldIfIsOf(Pair[fl.of], f)
  const a = this
  return Pair(a._1.concat(b._1), b._2(a._2))
}

// instance (Monoid a) => Applicative (Pair a b) where
//   of :: a -> Pair a
Pair.of = (a) => Pair(Q.empty, a)

flPatch(Pair)

module.exports = Pair
