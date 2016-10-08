const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')

const Pair = daggy.tagged('_1', '_2')

Pair[fl.of] = (a) => Pair(Q.empty, a)

Pair[fl.empty] = Pair[fl.of](Q.empty)

Pair.prototype[fl.concat] = function(b) {
  if (Q.isEmpty(this._1) || Q.isEmpty(this._2)) {
    return b
  } else if (Q.isEmpty(b) || Q.isEmpty(b._1) || Q.isEmpty(b._2)) {
    return this
  } else {
    return Pair(this._1[fl.concat](b._1), this._2[fl.concat](b._2))
  }
}

Pair.prototype[fl.equals] = function(b) {
  return equals(this._1, b._1) && equals(this._2, b._2)
}

Pair.prototype[fl.ap] = function(f) {
  const b = Q.foldIfIsOf(Pair[fl.of], f)
  const a = this
  return Pair(a._1.concat(b._1), b._2(a._2))
}

module.exports = Pair
