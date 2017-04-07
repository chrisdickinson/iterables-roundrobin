# @iterables/roundrobin

Given a set of iterables, take from each one in order until all are exhausted.

```javascript
const roundRobin = require('@iterables/roundrobin')

function * iter (what) {
  for (var i = 0; i < 2; ++i) {
    yield what
  }
}

for (const [idx, value] of roundRobin(iter('a'), iter('b'))) {
  console.log(idx, value) // 0 'a', 1 'b', 0 'a', 1 'b'
}
```

## Installation

```
$ npm install --save @iterables/roundrobin
```

## API

### `roundRobin(...iterables) -> Iterator<[index, T]>`

Given `iterables` as args, return an iterator that takes from each given
iterable in succession until all are exhausted, yielding a tuple of the
index of the iterable and the item it took. 

If `iterables` is uneven — say, one iterable has 2 items while another
has 5 — after the first iterable is exhausted `roundRobin` will take
exclusively from the second iterable.

## License

MIT
