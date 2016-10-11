const { test } = require('./lib')

const { of, empty } = require('../src/quasi.js')

const Func = require('../examples/Func.js')
const List = require('../examples/List.js')

test('eq', t => {
  const a = 'a'
  const fa = Func.of(List.fromArray([a]))
  const faa = Func.of(List.fromArray([a, a]))
  const faaa = Func.of(List.fromArray([a, a, a]))
  t.eqFL(faaa.run(), fa.concat(faa).run())
  t.eqFL(fa.run(), fa.concat(empty).run())
  t.eqFL(fa.run(), empty.concat(fa).run())
  t.eqFL(fa.run(), fa.concat(Func.empty).run())
  t.eqFL(fa.run(), Func.empty.concat(fa).run())
  t.eqFL(fa.run(), Func.of(a).map(a => List.fromArray([a])).run())
  t.eqFL(fa.run(), Func.of(a).ap(Func.of(a => List.fromArray([a]))).run())
  t.eqFL(fa.run(), of(a).ap(Func.of(a => List.fromArray([a]))).run())
  t.eqFL(fa.run(), Func.of(a).ap(of(a => List.fromArray([a]))).run())

  t.end()
})
