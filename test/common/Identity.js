const daggy = require('daggy')

const Q = require('../../src/quasi.js')
const equals = require('../../src/equals.js')
const fl = require('../../src/fl.js')
const flPatch = require('../../src/fl-patch.js')

const Identity = daggy.tagged('value')

Identity.of = (a) => Identity(a)

Identity.empty = Identity.of(Q.empty)

Identity.prototype.equals = function(b) {
  return equals(this.value, b.value)
}

Identity.prototype.chain = function(f) {
  return f(this.value)
}

const chainRecNext = value => ({ isNext: true, value })
const chainRecDone = value => ({ isNext: false, value })

Identity.chainRec = function(f, i) {
  var state = chainRecNext(i)
  while (state.isNext) {
    state = f(chainRecNext, chainRecDone, state.value).value
  }
  return Identity(state.value)
}

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

Identity.prototype.ap = function(f) {
  if (Q.isOf(f)) {
    return this.map(f.value)
  } else {
    return Identity(f.value(this.value))
  }
}

flPatch(Identity)

module.exports = Identity
