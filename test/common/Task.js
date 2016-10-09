const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

// type Task e a = Task ((e -> (), a -> ()) -> ())
const Task = daggy.tagged('fork')

// instance Semigroup a => Semigroup (Task e a) where
//   concat :: Task e a ~> Task e a -> Task e a
Task.prototype.concat = function(g) {
  if (Q.isEmpty(g)) {
    return this
  }
  return Task.parallel(this, Q.foldIfIsOf(Task[fl.of], g)).map(([a, b]) => {
    if (Q.isEmpty(a)) {
      return b
    } else if (Q.isEmpty(b)) {
      return a
    } else {
      return a[fl.concat](b)
    }
  })
}

// instance Monoid a => Monoid (Task e a) where
//   empty :: Task e a
Task.empty = Task((_, res) => res(Q.empty))

// instance Functor (Task e) where
//   map :: Task e a ~> (a -> b) -> Task e b
Task.prototype.map = function(f) {
  return Task((rej, res) => this.fork(rej, (v) => res(f(v))))
}

// instance => Apply (Task e) where
//   ap :: Task e a -> Task e (a -> b) -> Task e b
Task.prototype.ap = function(g) {
  return Task.parallel(this, g).map(([v,f]) => f(v))
}

// instance => Applicative (Task e) where
//   of :: a -> Task e a
Task.of = (a) => Task((rej, res) => res(a))

Task.parallel = function(a, b) {
  return Task((rej, res) => {
    let failed = false
    let aDone = false
    let bDone = false
    let aRes = null
    let bRes = null
    const fail = (err) => {
      if (!failed && !(aDone && bDone)) {
        rej(err)
      }
    }
    const check = () => {
      if (aDone && bDone && !failed) {
        res([aRes, bRes])
      }
    }
    a.fork(fail, (a) => {
      aDone = true
      aRes = a
      check()
    })
    b.fork(fail, (b) => {
      bDone = true
      bRes = b
      check()
    })
  })
}

flPatch([Task, Task.prototype])

module.exports = Task
