import { read, sort, log, last, serialize } from './lib.mjs';

const rowOfInterest = 2000000;

const pairs = read('./15.txt').map(row => {
  const matches = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
  if (!matches) {
    throw new Error(row);
  }
  return matches.slice(1, 5).map(value => parseInt(value));
});

// Rightmost known beacon
const max = Math.max(...pairs.map(pair => pair[2]));

let interdicted = pairs.reduce((segments, pair) => {
  const segment = findSegment(pair, rowOfInterest);
  if (!segment) {
    return segments;
  } else {
    return [...segments, segment ];
  }
}, []);

interdicted = sort(interdicted, (a, b) => a[0] - b[0]);

// Sort them and remove redundancies
interdicted = interdicted.reduce((interdicted, segment) => {
  const prev = last(interdicted);
  if (!prev) {
    return [ segment ];
  } else if (prev[1] >= segment[1]) {
    // Completely encloses the new segment, discard the latter
    return interdicted;
  } else if (prev[1] >= segment[0]) {
    const n = [ prev[1] + 1, segment[1] ];
    return [...interdicted, n]; 
  }
}, []);

const scanned = interdicted.reduce((sum, segment) => sum + (segment[1] - segment[0] + 1), 0);
const found = (new Set(pairs.filter(pair => pair[3] === rowOfInterest).map(pair => serialize(pair.slice(2))))).size;
console.log(scanned - found);

function findSegment(pair, iy) {
  const xd = pair[2] - pair[0];
  const yd = pair[3] - pair[1];
  const td = Math.abs(xd) + Math.abs(yd);
  if ((iy < pair[1] - td) || (iy > pair[1] + td)) {
    return false;
  }
  const iyd = Math.abs(pair[1] - iy);
  return [ pair[0] - (td - iyd), pair[0] + (td - iyd) ];
}

