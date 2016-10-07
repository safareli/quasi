const { test } = require('tap')
// const daggy = require('daggy')

const { of, empty } = require('../src/quasi.js')
const fl = require('../src/fl.js')

const Identity = require('./common/Identity.js')
const List = require('./common/List.js')
// const Pair = require('./common/Pair.js')
// const Func = require('./common/Func.js')
// const Task = require('./common/Task.js')

test('eq', t => {
  const a = 'a'
  const as = List.Cons(a, List.Nil)
  const eq = (title, a, b) => t.ok(a === b || a[fl.equals](b), title)

  t.notThrow(() => {
    eq('of.chainRec((next, done, v) => of(v === 0 ? done(v) : next(v - 1)), 100000) = of(0)',
        of[fl.chainRec]((next, done, v) => of(v === 0 ? done(v) : next(v - 1)), 100000), of(0))
  }, 'of.chainRec is stacksafe')
  t.throws(() => { empty[fl.map](a => a) }, 'throws method calls which need value', TypeError)
  t.throws(() => { empty[fl.ap](a => a) }, 'throws method calls which need value', TypeError)
  t.throws(() => { empty[fl.chain](a => a) }, 'throws method calls which need value', TypeError)
  eq('of.chainRec((next, done, v) => Identity(v === 0 ? done(v) : next(v - 1)), 10) = Identity(0)',
    of[fl.chainRec]((next, done, v) => Identity(v === 0 ? done(v) : next(v - 1)), 10), Identity(0))
  eq('of.chainRec((_, done, v) => Identity(done(v)), 10) = Identity(10)',
    of[fl.chainRec]((_, done, v) => Identity(done(v)), 10), Identity(10))
  eq('of(a).toString() = "<of>(a)"',
      of(a).toString(), '<of>(a)')
  eq('of(empty).toString() = "<of>(<empty>)"',
      of(empty).toString(), '<of>(<empty>)')
  eq('of(a).equals(Identity.of(a)) = true',
      of(a)[fl.equals](Identity[fl.of](a)), true)
  eq('of(empty).equals(empty) = true',
      of(empty)[fl.equals](empty), true)
  eq('of(empty).equals(of(empty)) = true',
      of(empty)[fl.equals](of(empty)), true)
  eq('empty.equals(of(empty)) = true',
      empty[fl.equals](of(empty)), true)
  eq('empty.equals(empty) = true',
      empty[fl.equals](empty), true)
  eq('of(a).equals(a) = false',
      of(a)[fl.equals](a), false)
  eq('of(empty).concat(of(empty)) = of(empty)',
      of(empty)[fl.concat](of(empty)), of(empty))
  eq('empty.concat(of(empty)), of(empty)',
      empty[fl.concat](of(empty)), of(empty))
  eq('of(empty).concat(empty) = of(empty)',
      of(empty)[fl.concat](empty), of(empty))
  eq('of([a]).concat(Identity([])) = Identity([a])',
      of(as)[fl.concat](Identity(List.Nil)), Identity(as))
  eq('Identity(empty).concat(of(a)) = Identity(a)',
      Identity(empty)[fl.concat](of(a)), Identity(a))
  eq('of(a).map(a => Identity(a)) = of(Identity(a))',
      of(a)[fl.map](a => Identity(a)), of(Identity(a)))
  eq('of(a).chain(a => of(a).chain(of)) = of(a)',
      of(a)[fl.chain](a => of(a)[fl.chain](of)), of(a))
  eq('of(a).chain(of).chain(of) = of(a)',
      of(a)[fl.chain](of)[fl.chain](of), of(a))
  eq('of(a).ap(of(a => a)) = of(a)',
      of(a)[fl.ap](of(a => a)), of(a))
  eq('of(a).chain(a => Identity(a)) = Identity(a)',
      of(a)[fl.chain](a => Identity(a)), Identity(a))
  eq('of(a).ap(of(a => Identity(a))), of(Identity(a))',
      of(a)[fl.ap](of(a => Identity(a))), of(Identity(a)))
  eq('of(a).ap(Identity(a => a)), Identity(a)',
      of(a)[fl.ap](Identity(a => a)), Identity(a))
  eq('of(a).ap(of(a => a)).chain(a => of(a)).chain(a => Identity(a))',
      of(a)[fl.ap](of(a => a))[fl.chain](a => of(a))[fl.chain](a => Identity(a)), Identity(a))
  eq('of(a).ap(Identity(a => a)), Identity(a)',
      of(a)[fl.ap](Identity(a => a)), Identity(a))

  t.end()
})
