import { read, log, serialize } from './lib.mjs';

const rows = read('./6.txt');

const chars = rows[0].split('');

log(startIndex(chars, [], 0));

function startIndex(chars, recent, i) {
  recent = [...recent, chars[i]];
  if (recent.length > 4) {
    recent = recent.slice(1);
  }
  if ((recent.length === 4) && (serialize(recent) === serialize([...new Set(recent)]))) {
    return i + 1;
  }
  // Tail recursion isn't really safe in most JavaScript implementations.
  // I get away with it here because the stack isn't deep enough for it to fail
  return startIndex(chars, recent, i + 1);
}
