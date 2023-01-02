import { read, allButLast, last, log } from './lib.mjs';

const pairs = read('./13.txt').reduce((pairs, row, i) => {
  if ((i % 3) === 0) {
    return [ ...pairs, [ parse(row) ] ];
  } else if ((i % 3) === 1) {
    return [ ...allButLast(pairs), [...last(pairs), parse(row) ] ];
  } else {
    // Blank line
    return pairs;
  }
}, []);

log(pairs.reduce((sum, pair, i) => sum + (compare(pair[0], pair[1]) < 0 ? (i + 1) : 0), 0));

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
