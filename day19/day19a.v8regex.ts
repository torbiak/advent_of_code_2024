// Only works if run with node's `--enable-experimental-regexp-engine` option.

import * as fs from 'fs';

function parseInput(s: string): [string[], string[]] {
  const lines = s.trim().split(/\n/);
  const towels = lines[0].split(/, /);
  const patterns = lines.slice(2);
  return [towels, patterns];
}

function countValidPatterns(input: string): number {
  const [towels, patterns] = parseInput(input);
  // The RegExp `l` flag specifies to use a non-backtracking state machine but
  // is only accepted when node is run with the
  // --enable-experimental-regexp-engine option.
  const regex = new RegExp(`^(${towels.join("|")})+$`, 'l');
  return patterns.reduce((sum, pattern) => {
    return sum + (regex.exec(pattern) ? 1 : 0)
  }, 0);
}

if (require.main === module) {
  const input = fs.readFileSync('input', {encoding: 'utf8'});
  console.log(countValidPatterns(input));
}
