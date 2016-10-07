const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const fl = require('../../src/fl.js')

const Task = daggy.tagged('fork')

Task[fl.of] = (a) => Task((rej, res) => res(a))

Task[fl.empty] = Task[fl.of](Q.empty)

Task.prototype[fl.map] = function(f) {
  return Task((rej, res) => this.fork(rej, (v) => res(f(v))))
}

Task.prototype[fl.concat] = function(g) {
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

module.exports = Task
