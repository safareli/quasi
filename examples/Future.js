const daggy = require('daggy')

const Q = require('../src/quasi.js')
const fl = require('../src/fl.js')
const flPatch = require('../src/fl-patch.js')

// type Future a = Future (a -> ()) -> ())
const Future = daggy.tagged('fork')

// instance Semigroup a => Semigroup (Future a) where
//   concat :: Future a ~> Future a -> Future a
Future.prototype.concat = function(g) {
  if (Q.isEmpty(g)) {
    return this
  }
  return Future.parallel(this, Q.foldIfIsOf(Future[fl.of], g)).map(([a, b]) => {
    if (Q.isEmpty(a)) {
      return b
    } else if (Q.isEmpty(b)) {
      return a
    } else {
      return a[fl.concat](b)
    }
  })
}

// instance Monoid a => Monoid (Future a) where
//   empty :: Future a
Future.empty = Future((done) => done(Q.empty))

// instance Functor Future where
//   map :: Future a ~> (a -> b) -> Future b
Future.prototype.map = function(f) {
  return Future((done) => this.fork((v) => done(f(v))))
}

// instance Apply Future where
//   ap :: Future a -> Future (a -> b) -> Future b
Future.prototype.ap = function(g) {
  return Future.parallel(this, Q.foldIfIsOf(Future[fl.of], g)).map(([v, f]) => f(v))
}

// instance Applicative Future where
//   of :: a -> Future a
Future.of = (a) => Future((done) => done(a))

Future.parallel = function(a, b) {
  return Future((done) => {
    let aDone = false
    let bDone = false
    let aRes = null
    let bRes = null
    const check = () => {
      if (aDone && bDone) {
        done([aRes, bRes])
      }
    }
    a.fork((a) => {
      aDone = true
      aRes = a
      check()
    })
    b.fork((b) => {
      bDone = true
      bRes = b
      check()
    })
  })
}

flPatch([Future, Future.prototype])

module.exports = Future
