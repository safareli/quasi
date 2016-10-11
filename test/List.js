const { test } = require('./lib')

const { of, empty } = require('../src/quasi.js')

const List = require('../examples/List.js')

test('eq', t => {
  const a = 'a'
  const as = List.fromArray([a])
  const a2s = List.fromArray([a, a])

  t.equals('Cons(a,Nil)', as.toString())
  t.eqFL(as, as.concat(empty))
  t.eqFL(a2s, as.concat(as))
  t.notOk(List.fromArray([a, a]).equals(List.fromArray([a])))
  t.notOk(List.fromArray([a]).equals(List.fromArray([a, a])))
  t.eqFL(of(as), of(a).reduce((acc, a) => List.Cons(a, acc), List.Nil))

  t.end()
})
