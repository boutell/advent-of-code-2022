import { read, sort, log, last, setIndex, serialize } from './lib.mjs';

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

for (let i = 0; (i < valves.length); i++) {
  log({ a: 0, b: i, path: shortestPath(valves, 0, i) });
}

// log(optimize({ valves, moves: [], location: 0, time: 0, value: 0 }));

function optimize(world) {
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
  if ((here.rate > 0) && !here.open) {
    moves.push({
      type: 'open'
    });
  }
  if (world.valves.some(valve => (valve.rate > 0) && !valve.open)) {
    here.tunnels.forEach(index => {
      if (!loops(world.moves, index)) {
        moves.push({
          type: 'location',
          location: index
        });
      }
    });
  }
  if (!moves.length) {
    moves.push({ type: 'pass' });
  }
  return moves;
}

function loops(moves, index) {
  let i = moves.length;
  while (true) { 
    i--;
    if (i < 0) {
      // If we got back to the start point without opening a valve, that's a loop too
      return index === 0;
    }
    if (moves[i].type === 'open') {
      return false;
    }
    if ((moves[i].type === 'location') && (moves[i].location === index)) {
      return true;
    }    
  }
  return false;
}

function shortestPath(valves, a, b, taken = []) {
  if (a === b) {
    return [];
  }
  if (valves[a].tunnels.includes(b)) {
    return [ b ];
  }
  return valves[a].tunnels.reduce((path, index) => {
    if (taken.includes(index)) {
      return path;
    }
    const subPath = shortestPath(valves, index, b, [...taken, index]);
    if (subPath) {
      const newPath = [ index, ...subPath ];
      if (!path || (newPath.length < path.length)) {
        return newPath;
      }
    }
    return path;
  }, false);
}
