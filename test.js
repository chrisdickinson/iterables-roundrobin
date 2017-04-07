'use strict'

const tap = require('tap')

const rrobin = require('./iterable-roundrobin')

function test (name, testCase) {
  return tap.test(name, assert => {
    testCase(assert)
    return Promise.resolve()
  })
}

test('fails if falsey iterable given', assert => {
  assert.throws(TypeError, () => {
    Array.from(rrobin(null))
  })
  assert.throws(TypeError, () => {
    Array.from(rrobin(false))
  })
  assert.throws(TypeError, () => {
    Array.from(rrobin(0))
  })
})

test('fails if non-iterable given', assert => {
  assert.throws(TypeError, () => {
    Array.from(rrobin({[Symbol.iterable]: null}))
  })
  assert.throws(TypeError, () => {
    Array.from(rrobin(true))
  })
  assert.throws(TypeError, () => {
    Array.from(rrobin(1))
  })
})

test('exhausts all (evenly)', assert => {
  const order = []
  const first = iter(2, () => order.push('1st'))
  const second = iter(2, () => order.push('2nd'))
  const third = iter(2, () => order.push('3rd'))

  assert.deepEqual(Array.from(rrobin(first, second, third)), [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1]
  ])

  assert.deepEqual(order, [
    '1st',
    '2nd',
    '3rd',
    '1st',
    '2nd',
    '3rd'
  ])
})

test('exhausts all (unevenly)', assert => {
  const order = []
  const first = iter(2, () => order.push('1st'))
  const second = iter(5, () => order.push('2nd'))
  const third = iter(3, () => order.push('3rd'))

  assert.deepEqual(Array.from(rrobin(first, second, third)), [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
    [1, 3],
    [1, 4]
  ])

  assert.deepEqual(order, [
    '1st',
    '2nd',
    '3rd',
    '1st',
    '2nd',
    '3rd',
    '2nd',
    '3rd',
    '2nd',
    '2nd'
  ])
})

test('exhausts empty set', assert => {
  assert.deepEqual(Array.from(rrobin()), [])
})

function * iter (size, oncall) {
  for (var i = 0; i < size; ++i) {
    oncall()
    yield i
  }
}
