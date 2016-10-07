const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const fl = require('../../src/fl.js')

const Func = daggy.tagged('run')

Func[fl.of] = (a) => Func((_) => a)

Func.prototype[fl.ap] = function(g) {
  const f = this
  return Func((x) => Q.foldIfIsOf(Func[fl.of], g).run(x)(f.run(x)))
}

Func[fl.empty] = Func[fl.of](Q.empty)

Func.prototype[fl.concat] = function(g) {
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

module.exports = Func
