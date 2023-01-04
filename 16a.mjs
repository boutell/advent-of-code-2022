import { read, sort, log, last, setIndex, serialize } from './lib.mjs';

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

log(optimize({ valves, moves: [], location: 0, time: 0, value: 0 }));

function optimize(world) {
  console.log(world.time);
  if (world.time === 30) {
    return world;
  }
  const legal = legalMoves(world);
  let best, bestValue = -1;
  for (const move of legal) {
    const mWorld = applyMove(world, move);
    const oWorld = optimize(mWorld);
    if (oWorld.value > bestValue) {
      best = oWorld;
      bestValue = oWorld.value;
    }
  }
  return best || world;
}

function applyMove(world, move) {
  const nWorld = {...world };
  nWorld.value = nWorld.valves.reduce((sum, valve) => sum + (valve.open ? valve.rate : 0), world.value);
  nWorld.time++;
  if (move.type === 'location') {
    nWorld.location = move.location;
  } else if (move.type === 'open') {
    nWorld.valves = setIndex(nWorld.valves, nWorld.location, { ...nWorld.valves[nWorld.location], open: true });
  } else if (move.type === 'pass') {
    // Do nothing, let time pass
  } else {
    throw new Error(`Unknown move type: ${move.type}`);
  }
  nWorld.moves = [ ...nWorld.moves, move ];
  return nWorld;
}

function legalMoves(world) {
  const here = world.valves[world.location];
  const moves = [];
  console.log({
    time: world.time,
    value: world.value,
    valves: world.valves
  });
  if ((here.rate > 0) && !here.open) {
    moves.push({
      type: 'open'
    });
  }
  if (world.valves.some(valve => !valve.open)) {
    here.tunnels.forEach(index => moves.push({
      type: 'location',
      location: index
    }));
  } else {
    console.log('stop');
  }
  return moves;
}
