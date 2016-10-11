const { test } = require('./lib')

const { of, empty } = require('../src/quasi.js')

const Future = require('../examples/Future.js')
const List = require('../examples/List.js')

test('eq', t => {
  const a = 'a'
  const as = List.fromArray([a])
  const a2s = List.fromArray([a, a])
  const FutureEq = (a, b) => Future.parallel(a, b).fork(([a, b]) => t.eqFL(a, b))

  FutureEq(Future.of(as), Future.of(as).concat(empty))
  FutureEq(Future.of(as), Future.of(as).concat(of(empty)))
  FutureEq(Future.of(as), Future.of(as).concat(Future.empty))
  FutureEq(Future.of(as), empty.concat(Future.of(as)))
  FutureEq(Future.of(as), Future.empty.concat(Future.of(as)))
  FutureEq(Future.of(a2s), Future.of(as).concat(Future.of(as)))
  FutureEq(Future.of(a2s), Future.of(as).ap(of(as => as.concat(as))))
  FutureEq(Future.of(a2s), Future.of(as).ap(Future.of(as => as.concat(as))))
  FutureEq(Future.of(a2s), of(as).ap(Future.of(as => as.concat(as))))

  t.end()
})
