import { read, allButLast, last, log } from './lib.mjs';

const { sensors, beacons } = read('./15.txt').map(row => {
  const matches = row.match(/Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/);
  if (!matches) {
    throw new Error(row);
  }
  return matches.slice(1, 5);
}).reduce(({ sensors, beacons }, [ sx, sy, bx, by ]) => {
  return {
    sensors: [...sensors, [ sx, sy ] ],
    beacons: beacons.find(beacon => (beacon[0] === bx) && (beacon[1] === by)) ? beacons : [ ...beacons, [ bx, by ] ]
  };
}, { sensors: [], beacons: [] });

const max = Math.max(...[...beacons.map(beacon => beacon[0]), ...sensors.map(sensor => sensor[0]) ]);

const interdicted = 
