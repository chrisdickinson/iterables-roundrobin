'use strict'

module.exports = roundrobin

function * roundrobin () {
  const iterators = Array.from(arguments)
  for (var i = 0; i < iterators.length; ++i) {
    if (!iterators[i] || typeof iterators[i][Symbol.iterator] !== 'function') {
      throw new TypeError(`expected argument ${i} to be an iterable`)
    }
    iterators[i] = iterators[i][Symbol.iterator]()
  }

  let active = iterators.length
  while (active) {
    for (const idx of iterators.keys()) {
      const iter = iterators[idx]
      if (iter === null) {
        continue
      }

      const cursor = iter.next()
      if (cursor.done) {
        iterators[idx] = null
        --active
        continue
      }

      yield [idx, cursor.value]
    }
  }
}
