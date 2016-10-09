const fl = require('./fl.js')
const flPatch = require('./fl-patch.js')
const { equals, chainRecNext, chainRecDone } = require('./shared.js')
const key$of = '@functional/of'
const key$empty = '@functional/empty'
const isEmpty = m => m[key$empty] === true
const isOf = a => a[key$of] === true
const methodNeedsValueErrorTpl = (methodName) =>
  'can not call [' + methodName + '] method as current instance does not contain a value'

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

// instance Setoid a => Setoid (Identity a) where
//   equals :: Identity a ~> Identity a -> Boolean
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

// instance Semigroup (m a) where
//   concat :: m a ~> m a -> m a
Of.prototype.concat = function(b) {
  if (isOf(b)) {
    return Of(this.value[fl.concat](b.value))
  } else if (isEmpty(b)) {
    return Of(this.value)
  } else {
    return b.constructor[fl.of](this.value)[fl.concat](b)
  }
}

// it represents `empty` value of some Monoid, type is not know yet like result of `Of`
// instance Monoid (m a) where
//   empty :: m a
Of.empty = {
  [key$empty]: true,
  constructor: Of,
  toString: () => '<empty>',
  equals: (a) => isEmpty(a) || (isOf(a) && isEmpty(a.value)),
  concat: (a) => a,
  map: (_) => { throw new TypeError(methodNeedsValueErrorTpl('map'))},
  ap: (_) => { throw new TypeError(methodNeedsValueErrorTpl('ap'))},
  reduce: (_, _2) => { throw new TypeError(methodNeedsValueErrorTpl('reduce'))},
  chain: (_) => { throw new TypeError(methodNeedsValueErrorTpl('chain'))},
}

// instance Functor m where
//   map :: m a ~> (a -> b) -> m b
Of.prototype.map = function(f) {
  return Of(f(this.value))
}

// instance Apply m where
//   ap :: m a ~> m (a -> b) -> m b
Of.prototype.ap = function(f) {
  return isOf(f) ? Of(f.value(this.value)) : f.constructor[fl.of](this.value)[fl.ap](f)
}

// instance Applicative m where
//   of :: a -> m a
Of.of = (a) => Of(a)

// instance Foldable m where
//   reduce :: m a ~> ((b, a) -> b) -> b -> m b
Of.prototype.reduce = function(f, i) {
  return Of(f(i, this.value))
}
// instance Chain m where
//   chain :: m a ~> (a -> m b) -> m b
Of.prototype.chain = function(f) {
  return f(this.value)
}

// instance ChainRec m where
//   chainRec :: ((a -> c, b -> c, a) -> m c, a) -> m b
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

Of.prototype[key$of] = true

Of.prototype.toString = function() {
  return '<of>(' + this.value + ')'
}

const foldIfIsOf = (f, a) => isOf(a) ? f(a.value) : a

flPatch([Of, Of.prototype, Of.empty])

module.exports = {
  empty: Of.empty,
  isEmpty,
  of: Of,
  isOf,
  foldIfIsOf,
}
