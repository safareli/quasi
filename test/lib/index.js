const { test, Test } = require('tap')

const { equals } = require('../../src/shared.js')

Test.prototype.addAssert('eqFL', 2, function(f, w, m, e) {
  m = m || 'should be equal'
  if (f === w || equals(f, w)) {
    return this.pass(m, e)
  }
  e.found = f
  e.wanted = w
  e.compare = 'fantasy-land/equals'
  return this.fail(m, e)
})

module.exports = {
  test,
}
