import { readFileSync } from 'fs';

export {
  read,
  overlaps,
  last,
  allButLast,
  fill,
  splitByN,
  set,
  log
};

function read(file) {
  return log(readFileSync(file, 'utf8').trimRight().split(/\n/).map(row => row.trimRight()));
}

// Do two ordered ranges overlap?
function overlaps(p1, p2) {
  // Test both ways in case p2 encloses p1 etc.
  return half(p1, p2) || half(p2, p1);
  function half(p1, p2) {
    // Why is this extra set of parens important? I have no idea
    return (
      // p1 encloses p2 entirely
      ((p1[0] <= p2[0]) && (p1[1] >= p2[1])) ||
      // p1 encloses first point of p2
      ((p1[0] <= p2[0]) && (p1[1] >= p2[0])) ||
      // p1 encloses second point of p2
      ((p1[0] <= p2[1]) && (p1[1] >= p2[1]))
    );
  }
}

function last(a) {
  return a[a.length - 1 ];
}

function allButLast(a) {
  return a.slice(0, a.length - 1);
}

function fill(a, length, fill) {
  const result = [...a];
  for (let i = a.length; (i < length); i++) {
    result.push(fill());
  }
  return result;
}

// Return a new array in which a[i] is set to v and the other values are unchanged
function set(a, i, v) {
  return [...a.slice(0, i), v, ...a.slice(i + 1)];
}

// Split a string s into substrings of length n

function splitByN(s, n) {
  const cols = [];
  for (let i = 0; (i < s.length); i += n) {
    cols.push(s.slice(i, i + n));
  }
  return cols;
}

function log(v) {
  console.log(JSON.stringify(v, null, '  '));
  return v;
}
