const { test } = require('./lib')

const { of, empty } = require('../src/quasi.js')

const Identity = require('./common/Identity.js')
const List = require('./common/List.js')
// const Pair = require('./common/Pair.js')
// const Func = require('./common/Func.js')
// const Task = require('./common/Task.js')

test('eq', t => {
  const a = 'a'
  const as = List.Cons(a, List.Nil)
  t.notThrow(() => {
    t.eqFL(of(0), of.chainRec((next, done, v) => of(v === 0 ? done(v) : next(v - 1)), 100000))
  }, 'chainRec is stacksafe')
  t.throws(() => { empty.map(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.ap(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.chain(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.reduce((acc, a) => List.Cons(a, acc), List.Nil) }, 'throws on method calls which need value', TypeError)
  t.eqFL(Identity(0), of.chainRec((next, done, v) => Identity(v === 0 ? done(v) : next(v - 1)), 10))
  t.eqFL(Identity(10), of.chainRec((_, done, v) => Identity(done(v)), 10))
  t.eqFL('<of>(a)', of(a).toString())
  t.eqFL('<of>(<empty>)', of(empty).toString())
  t.ok(of(a).equals(Identity.of(a)))
  t.ok(of(empty).equals(empty))
  t.ok(of(empty).equals(of(empty)))
  t.ok(empty.equals(of(empty)))
  t.ok(empty.equals(empty))
  t.notOk(of(a).equals(a))
  t.eqFL(of(empty), of(empty).concat(of(empty)))
  t.eqFL(of(a), of(a).constructor.of(a))
  t.eqFL(of(List.Cons(a, List.Nil)), of(a).reduce((acc,a) => List.Cons(a, acc), List.Nil))
  t.eqFL(of(empty), empty.concat(of(empty)))
  t.eqFL(of(empty), of(empty).concat(empty))
  t.eqFL(Identity(as), of(as).concat(Identity(List.Nil)))
  t.eqFL(Identity(a), Identity(empty).concat(of(a)))
  t.eqFL(of(Identity(a)), of(a).map(a => Identity(a)))
  t.eqFL(of(a), of(a).chain(a => of(a).chain(of)))
  t.eqFL(of(a), of(a).chain(of).chain(of))
  t.eqFL(of(a), of(a).ap(of(a => a)))
  t.eqFL(Identity(a), of(a).chain(a => Identity(a)))
  t.eqFL(of(Identity(a)), of(a).ap(of(a => Identity(a))))
  t.eqFL(Identity(a), of(a).ap(Identity(a => a)))
  t.eqFL(Identity(a), of(a).ap(of(a => a)).chain(a => of(a)).chain(a => Identity(a)))
  t.eqFL(Identity(a), of(a).ap(Identity(a => a)))

  t.end()
})
