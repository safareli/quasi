const fl = require('./fl.js')

const equals = (a, b) => a === b || (typeof a[fl.equals] === 'function' && a[fl.equals](b))

const chainRecNext = value => ({ isNext: true, value })

const chainRecDone = value => ({ isNext: false, value })

module.exports = {
  equals,
  chainRecNext,
  chainRecDone,
}
