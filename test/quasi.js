const { test } = require('./lib')

const { of, empty, chainRec } = require('../src/quasi.js')

test('throws', t => {
  t.notThrow(() => {
    t.eqFL(of(0), chainRec((next, done, v) => of(v === 0 ? done(v) : next(v - 1)), 100000))
  }, 'chainRec is stacksafe')
  t.throws(() => { empty.map(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.ap(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.chain(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.reduce((acc, a) => acc.concat([a]), []) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.traverse(a => a) }, 'throws on method calls which need value', TypeError)
  t.throws(() => { empty.extract(a => a) }, 'throws on method calls which need value', TypeError)

  t.end()
})

test('eq', t => {
  const a = 'a'

  t.eqFL('<of>(a)', of(a).toString())
  t.eqFL('<of>(<empty>)', of(empty).toString())
  t.ok(of(empty).equals(empty))
  t.ok(of(empty).equals(of(empty)))
  t.ok(empty.equals(of(empty)))
  t.ok(empty.equals(empty))
  t.notOk(of(a).equals(a))
  t.eqFL(of(empty), of(empty).concat(of(empty)))
  t.eqFL(of(a), of(a).constructor.of(a))
  t.eqFL(of(empty), empty.concat(of(empty)))
  t.eqFL(of(empty), of(empty).concat(empty))
  t.eqFL(of(a), of(a).chain(a => of(a).chain(of)))
  t.eqFL(of(a), of(a).chain(of).chain(of))
  t.eqFL(of(a), of(a).ap(of(a => a)))

  t.end()
})
