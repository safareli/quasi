const fl = require('./fl.js')
const namespace = (typeRep) => {
  Object.keys(fl).forEach(key => {
    if (typeof typeRep[key] === 'function') {
      typeRep[fl[key]] = typeRep[key]
    }
    if (typeRep.prototype && typeof typeRep.prototype[key] === 'function') {
      typeRep.prototype[fl[key]] = typeRep.prototype[key]
    }
  })
}
module.exports = namespace
