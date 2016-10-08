const fl = require('./fl.js')

const equals = (a, b) => a === b || (typeof a[fl.equals] === 'function' && a[fl.equals](b))

module.exports = equals
