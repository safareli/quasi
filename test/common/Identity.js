const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

// type Identity a = Identity a
const Identity = daggy.tagged('value')

// instance Setoid a => Setoid (Identity a) where
//   equals :: Identity a ~> Identity a -> Boolean
Identity.prototype.equals = function(b) {
  return equals(this.value, b.value)
}

// instance Semigroup a => Semigroup (Identity a) where
//   concat :: Identity a ~> Identity a -> Identity a
Identity.prototype.concat = function(b) {
  b = Q.foldIfIsOf(Identity[fl.of], b)
  if (Q.isEmpty(this.value)) {
    return b
  } else if (Q.isEmpty(b) || Q.isEmpty(b.value)) {
    return this
  } else {
    return Identity(this.value[fl.concat](b.value))
  }
}

// instance Monoid a => Monoid (Identity a) where
//   empty :: Identity a
Identity.empty = Identity(Q.empty)

// instance Functor Identity where
//   map :: Identity a ~> (a -> b) -> Identity b
Identity.prototype.map = function(f) {
  return Identity(f(this.value))
}

// instance Apply Identity where
//   ap :: Identity a ~> Identity (a -> b) -> Identity b
Identity.prototype.ap = function(f) {
  if (Q.isOf(f)) {
    return this.map(f.value)
  } else {
    return Identity(f.value(this.value))
  }
}

// instance Applicative Identity where
//   of :: a -> Identity a
Identity.of = (a) => Identity(a)

// instance Chain Identity where
//   chain :: Identity a ~> (a -> Identity b) -> Identity b
Identity.prototype.chain = function(f) {
  return f(this.value)
}

const chainRecNext = value => ({ isNext: true, value })
const chainRecDone = value => ({ isNext: false, value })

// instance ChainRec Identity where
//   chainRec :: ((a -> c, b -> c, a) -> Identity c, a) -> Identity b
Identity.chainRec = function(f, i) {
  var state = chainRecNext(i)
  while (state.isNext) {
    state = f(chainRecNext, chainRecDone, state.value).value
  }
  return Identity(state.value)
}

flPatch([Identity, Identity.prototype])

module.exports = Identity
