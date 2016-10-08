const fl = require('./fl.js')
const equals = require('./equals.js')
const key$of = '@functional/of'
const key$empty = '@functional/empty'
const isEmpty = m => m[key$empty] === true
const isOf = a => a[key$of] === true

// `of` createas container for a value which currently has no type.
// result could conforms to specifications: Functor, Apply,
// Applicative, Chain, ChainRec, Monad, Semigroup, Monoid and Setoid
//    of :: a => m a
const of = (a) => ({
  [key$of]: true,
  value: a,
  constructor: of,
  toString: () => '<of>(' + a + ')',
  [fl.map]: (f) => of(f(a)),
  [fl.ap]: (f) => isOf(f) ? of(f.value(a)) : f.constructor[fl.of](a)[fl.ap](f),
  [fl.chain]: (f) => f(a),
  [fl.equals]: (b) => {
    if (isOf(b)) {
      return equals(a, b.value)
    } else if (isEmpty(a)) {
      return isEmpty(b)
    } else if (typeof b.constructor[fl.of] === 'function') {
      return b.constructor[fl.of](a)[fl.equals](b)
    } else {
      return false
    }
  },
  [fl.concat]: (b) => {
    if (isOf(b)) {
      return of(a[fl.concat](b.value))
    } else if (isEmpty(b)) {
      return of(a)
    } else {
      return b.constructor[fl.of](a)[fl.concat](b)
    }
  },
})

const methodNeedsValueErrorTpl = (methodName) =>
  'can not call [' + methodName + '] method as current instance does not contain a value'

// it represents `empty` value of some Monoid type is not know yet like result of `of`
const empty = {
  [key$empty]: true,
  toString: () => '<empty>',
  constructor: of,
  [fl.map]: (_) => { throw new TypeError(methodNeedsValueErrorTpl('map')) },
  [fl.ap]: (_) => { throw new TypeError(methodNeedsValueErrorTpl('ap')) },
  [fl.chain]: (_) => { throw new TypeError(methodNeedsValueErrorTpl('chain')) },
  [fl.concat]: a => a,
  [fl.equals]: a => isEmpty(a) || (isOf(a) && isEmpty(a.value)),
}

of[fl.empty] = empty
of[fl.of] = of

const chainRecNext = value => ({ isNext: true, value })
const chainRecDone = value => ({ isNext: false, value })
of[fl.chainRec] = (f, i) => {
  let step = f(chainRecNext, chainRecDone, i)
  while (isOf(step) && step.value.isNext) {
    step = f(chainRecNext, chainRecDone, step.value.value)
  }
  if (isOf(step)) {
    return of(step.value.value)
  }
  return step[fl.chain](({ isNext, value }) =>
    isNext ? step.constructor[fl.chainRec](f, value) : step.constructor[fl.of](value)
  )
}

const foldIfIsOf = (f, a) => isOf(a) ? f(a.value) : a

module.exports = {
  empty,
  isEmpty,
  of,
  isOf,
  foldIfIsOf,
}
