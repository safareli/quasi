const fl = require('./fl.js')

const patch = obj => Object.keys(fl).forEach(key => {
  if (typeof obj[key] === 'function') {
    obj[fl[key]] = obj[key]
  }
})

const patchAll = (objs) => objs.forEach(patch)

module.exports = patchAll
