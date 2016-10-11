const { test } = require('./lib')

const { of, empty, chainRec } = require('../src/quasi.js')

const Identity = require('../examples/Identity.js')
const List = require('../examples/List.js')

test('eq', t => {
  const a = 'a'
  const as = List.fromArray([a])

  t.eqFL(Identity(0), chainRec((next, done, v) => Identity(v === 0 ? done(v) : next(v - 1)), 10))
  t.eqFL(Identity(10), chainRec((_, done, v) => Identity(done(v)), 10))
  t.ok(of(a).equals(Identity.of(a)))
  t.eqFL(Identity(of(a)), of(a).traverse((a) => Identity(a), Identity.of))
  t.eqFL(of(Identity(of(a))), of(a).extend((a) => Identity(a)))
  t.eqFL(of(Identity(of(empty))), empty.extend((a) => Identity(a)))
  t.eqFL(Identity(a), of(Identity(a)).extract())
  t.eqFL(of(List.Cons(a, List.Nil)), of(a).reduce((acc, a) => List.Cons(a, acc), List.Nil))
  t.eqFL(Identity(as), of(as).concat(Identity(List.Nil)))
  t.eqFL(Identity(a), Identity(empty).concat(of(a)))
  t.eqFL(of(Identity(a)), of(a).map(a => Identity(a)))
  t.eqFL(Identity(a), of(a).chain(a => Identity(a)))
  t.eqFL(of(Identity(a)), of(a).ap(of(a => Identity(a))))
  t.eqFL(Identity(a), of(a).ap(Identity(a => a)))
  t.eqFL(Identity(a), of(a).ap(of(a => a)).chain(a => of(a)).chain(a => Identity(a)))
  t.eqFL(Identity(a), of(a).ap(Identity(a => a)))
  t.eqFL(Identity(a), Identity(a).concat(empty))
  t.eqFL(Identity(a), Identity(a).ap(of(a => a)))

  t.end()
})
