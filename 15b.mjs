import { read, sort, log, last, serialize } from './lib.mjs';

const bound = 4000000;

const pairs = read('./15.txt').map(row => {
  const matches = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
  if (!matches) {
    throw new Error(row);
  }
  return matches.slice(1, 5).map(value => parseInt(value));
});

// Rightmost known beacon
const max = Math.max(...pairs.map(pair => pair[2]));

for (let rowOfInterest = 0; (rowOfInterest <= bound); rowOfInterest++) {
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
    } else {
      return [...interdicted, segment];
    }
  }, []);

  // Cut off at left bound
  interdicted = interdicted.reduce((interdicted, segment) => {
    if (segment[1] < 0) {
      return interdicted;
    } else if (segment[0] < 0) {
      return [...interdicted, [ 0, segment[1] ]];
    } else {
      return [...interdicted, segment ];
    }
  }, []);

  // Cut off at right bound
  interdicted = interdicted.reduce((interdicted, segment) => {
    if (segment[0] > bound) {
      return interdicted;
    } else if (segment[1] > bound) {
      return [...interdicted, [ segment[0], bound ]];
    } else {
      return [...interdicted, segment ];
    }
  }, []);
  const scanned = interdicted.reduce((sum, segment) => sum + (segment[1] - segment[0] + 1), 0);
  if (scanned < bound + 1) {
    for (let x = 0; (x <= bound); x++) {
      if (!interdicted.find(segment => (segment[0] <= x) && (segment[1] >= x))) {
        console.log(x, rowOfInterest, x * bound + rowOfInterest);
      } 
    }
    break;
  }
  if (!(rowOfInterest % 1000)) {
    // Progress display
    console.log(Math.round(rowOfInterest / 4000000 * 10000) / 100 + '%');
  }
}

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

