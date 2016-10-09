const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

// type Func a b = Func (a -> b)
const Func = daggy.tagged('run')

// instance Semigroup b => Semigroup (Func a b) where
//   concat :: Func a b ~> Func a b -> Func a b
Func.prototype.concat = function(g) {
  if (Q.isEmpty(g)) {
    return this
  }
  return Func((x) => {
    const a = this.run(x)
    const b = Q.foldIfIsOf(Func[fl.of], g).run(x)
    if (Q.isEmpty(a)) {
      return b
    } else if (Q.isEmpty(b)) {
      return a
    } else {
      return a[fl.concat](b)
    }
  })
}

// instance Monoid b => Monoid (Func a b) where
//   empty :: Func a b
Func.empty = Func((_) => Q.empty)

// instance Functor (Func a) where
//   map :: Func a b ~> (b -> c)  -> Func a c
Func.prototype.map = function(f) {
  return Func((x) => f(this.run(x)))
}

// instance Apply (Func a) where
//   ap :: Func a b ~> Func a (b -> c)  -> Func a c
Func.prototype.ap = function(g) {
  const f = this
  return Func((x) => Q.foldIfIsOf(Func[fl.of], g).run(x)(f.run(x)))
}

// instance Applicative (Func a) where
//   of :: b -> Func a b
Func.of = (a) => Func((_) => a)

flPatch([Func, Func.prototype])

module.exports = Func
