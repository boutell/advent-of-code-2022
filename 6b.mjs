import { read, log, serialize } from './lib.mjs';

const messageLength = 14;

const rows = read('./6.txt');

const chars = rows[0].split('');

log(startIndex(chars, [], 0));

function startIndex(chars, recent, i) {
  recent = [...recent, chars[i]];
  if (recent.length > messageLength) {
    recent = recent.slice(1);
  }
  if ((recent.length === messageLength) && (serialize(recent) === serialize([...new Set(recent)]))) {
    return i + 1;
  }
  // Tail recursion
  return startIndex(chars, recent, i + 1);
}
