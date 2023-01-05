import { read, sort, log, last, set, memoize, serialize } from './lib.mjs';

const shortestPath = memoize(shortestPathBody);

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, index: i, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

log(optimize({ valves, moves: [], open: set(), location: 0, time: 0, value: 0, depth: 0 }));

function optimize(world) {
  console.log(world.depth, world.time);
  if (world.time === 30) {
    return world;
  }
  const legal = legalMoves(world);
  let best, bestValue = -1;
  for (const move of legal) {
    const mWorld = applyMove(world, move);
    console.log(`> ${mWorld.time}`);
    const oWorld = optimize({...mWorld, depth: mWorld.depth + 1 });
    if (oWorld.value > bestValue) {
      best = oWorld;
      bestValue = oWorld.value;
    }
  }
  return best || world;
}

function applyMove(world, move) {
  if (move.type === 'path') {
    for (const location of move.path) {
      world = tick(world);
      console.log(`-- ${world.time}`);
      world = { ...world, location };
    }
  } else if (move.type === 'open') {
    world = tick(world);
    world = { ...world, open: world.open.add(world.location) };
  } else if (move.type === 'pass') {
    // Do nothing, let time pass
    world = tick(world);
  } else {
    throw new Error(`Unknown move type: ${move.type}`);
  }
  world = { ...world, moves: [ ...world.moves, move ] };
  return world;
}

function tick(world) {
  console.log('ticking');
  const nWorld = {...world };
  nWorld.value = nWorld.valves.reduce((sum, valve) => sum + (world.open.has(valve.index) ? valve.rate : 0), world.value);
  nWorld.time++;
  return nWorld;
}

function legalMoves(world) {
  const here = world.valves[world.location];
  const moves = [];
  console.log(here);
  if ((here.rate > 0) && !world.open.has(here.index)) {
    moves.push({
      type: 'open'
    });
  }
  world.valves.filter(valve => (world.location !== valve.index) && (valve.rate > 0) && !world.open.has(valve.index)).forEach((valve, i) => {
    console.log(`${world.location} ${valve.index}`);
    const path = shortestPath(world.valves, world.location, i);
    if (path) {
      moves.push({
        type: 'path',
        path
      });
    }
  });
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

function shortestPathBody(valves, a, b, taken = []) {
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
    const subPath = shortestPathBody(valves, index, b, [...taken, index]);
    if (subPath) {
      const newPath = [ index, ...subPath ];
      if (!path || (newPath.length < path.length)) {
        return newPath;
      }
    }
    return path;
  }, false);
}
