const fl = require('./fl.js')
const flPatch = require('./fl-patch.js')
const { equals, chainRecNext, chainRecDone } = require('./shared.js')
const key$of = '@functional/of'
const key$empty = '@functional/empty'
const isEmpty = m => m[key$empty] === true
const isOf = a => a[key$of] === true

// `of` createas container for a value which currently has no type.
// result could conforms to specifications: Functor, Apply,
// Applicative, Chain, ChainRec, Monad, Semigroup, Monoid and Setoid
//    of :: a => m a
function Of(value) {
  if (!(this instanceof Of)) {
    return new Of(value)
  }
  this.value = value
}

Of.prototype[key$of] = true

Of.prototype.toString = function() {
  return '<of>(' + this.value + ')'
}

Of.prototype.map = function(f) {
  return Of(f(this.value))
}

Of.prototype.ap = function(f) {
  return isOf(f) ? Of(f.value(this.value)) : f.constructor[fl.of](this.value)[fl.ap](f)
}

Of.prototype.chain = function(f) {
  return f(this.value)
}

Of.prototype.equals = function(b) {
  if (isOf(b)) {
    return equals(this.value, b.value)
  } else if (isEmpty(this.value)) {
    return isEmpty(b)
  } else if (typeof b.constructor[fl.of] === 'function') {
    return b.constructor[fl.of](this.value)[fl.equals](b)
  } else {
    return false
  }
}

Of.prototype.concat = function(b) {
  if (isOf(b)) {
    return Of(this.value[fl.concat](b.value))
  } else if (isEmpty(b)) {
    return Of(this.value)
  } else {
    return b.constructor[fl.of](this.value)[fl.concat](b)
  }
}

const methodNeedsValueErrorTpl = (methodName) =>
  'can not call [' + methodName + '] method as current instance does not contain a value'

// it represents `empty` value of some Monoid, type is not know yet like result of `Of`
const empty = {
  [key$empty]: true,
  constructor: Of,
  toString: () => '<empty>',
  equals: (a) => isEmpty(a) || (isOf(a) && isEmpty(a.value)),
  concat: (a) => a,
  map: (_) => { throw new TypeError(methodNeedsValueErrorTpl('map'))},
  ap: (_) => { throw new TypeError(methodNeedsValueErrorTpl('ap'))},
  chain: (_) => { throw new TypeError(methodNeedsValueErrorTpl('chain'))},
}

Of.empty = empty

Of.of = Of



Of.chainRec = (f, i) => {
  let step = f(chainRecNext, chainRecDone, i)
  while (isOf(step) && step.value.isNext) {
    step = f(chainRecNext, chainRecDone, step.value.value)
  }
  if (isOf(step)) {
    return Of(step.value.value)
  }

  return step[fl.chain](({ isNext, value }) =>
    isNext ? step.constructor[fl.chainRec](f, value) : step.constructor[fl.of](value)
  )
}

const foldIfIsOf = (f, a) => isOf(a) ? f(a.value) : a


flPatch([Of, Of.prototype, Of.empty])

module.exports = {
  empty,
  isEmpty,
  of: Of,
  isOf,
  foldIfIsOf,
}
