import { read, allButLast, last, sort, log, serialize } from './lib.mjs';

const packets = sort([ ...read('./13.txt').filter(row => row.length > 0).map(row => parse(row)), [[2]], [[6]] ], compare);

log(packets);

log((packets.findIndex(packet => serialize(packet) === '[[2]]') + 1) *
  (packets.findIndex(packet => serialize(packet) === '[[6]]') + 1));

function parse(row) {
  let i = 0;
  return parseList(row); 
  function parseList() {
    const list = [];
    const token = next();
    if (token !== '[') {
      throw new Error('list expected');
    }
    while (true) {
      const token = peek();
      if (token === ']') {
        next();
        return list;
      } else if (token === ',') {
        next();
        list.push(parseListEntry());
      } else {
        list.push(parseListEntry());
      }
    }
  }
  function parseListEntry() {
    const token = peek();
    if (token === '[') {
      return parseList();
    } else if ((typeof token) === 'number') {
      return next();
    } else {
      throw new Error(`Unexpected token: ${token}`);
    }
  }
  function get(consume) {
    const ch = row.charAt(i);
    if ('[,]'.includes(ch)) {
      if (consume) {
        i++;
      }
      return ch;
    }
    const number = row.substring(i).match(/\d+/);
    if (!number) {
      throw new Error(`Tokenizer error: ${row.substring(i)}`);
    }
    if (consume) {
      i += number.length;
    }
    return parseInt(number);
  }
  function peek() {
    return get(false);
  }
  function next() {
    return get(true);
  }
}

function compare(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return compareList(a, b);
  } else if (Array.isArray(a)) {
    return compareList(a, [ b ]);
  } else if (Array.isArray(b)) {
    return compareList([ a ], b);
  } else {
    return a - b;
  }
}

function compareList(a, b) {
  let i = 0;
  while (true) {
    if (a[i] === undefined) {
      if (b[i] === undefined) {
        return 0;
      } else {
        return -1;
      }
    } else if (b[i] === undefined) {
      return 1;
    }
    const v = compare(a[i], b[i]);
    if (v !== 0) {
      return v;
    }
    i++;
  }
  return 0;
}
