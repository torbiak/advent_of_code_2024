import * as fs from 'fs';

function parseInput(s: string): [string[], string[]] {
  const lines = s.trim().split(/\n/);
  const towels = lines[0].split(/, /);
  const patterns = lines.slice(2);
  return [towels, patterns];
}

function countValidPatterns(input: string): number {
  const [towels, patterns] = parseInput(input);
  const matcher = Matcher.fromStrings(towels);
  return patterns.reduce((sum, pattern) => {
    if (matcher.matches(pattern)) log(pattern)
    return sum + (matcher.matches(pattern) ? 1 : 0)
  }, 0);
}

type State = { [key: string]: State[]};

class Matcher {
  static accept: State = {};
  start: State;

  constructor(start: State) {
    this.start = start;
  }

  matches(s: string): boolean {
    let states = new Set([this.start]);
    for (const c of s) {
      const nexts = Matcher.move(states, c);
      if (nexts.size === 0) {
        return false;
      }
      states = nexts;
    }
    const nexts = Matcher.move(states, '$');
    return nexts.has(Matcher.accept);
  }

  static move(states: Set<State>, c: string): Set<State> {
    // Follow empty/'' edges.
    // We're assuming that we don't have chains of empty edges.
    const currents = new Set<State>();
    for (const state of states) {
      currents.add(state);
      if (!state['']) continue;
      state[''].forEach(s => currents.add(s));
    }
    // Follow edges for the given character.
    const nexts = new Set<State>();
    for (const current of currents) {
      if (!current[c]) continue;
      current[c].forEach(s => nexts.add(s));
    }
    return nexts;
  }

  static fromStrings(strings: string[]): Matcher {
    const start: State = {};
    const end: State = {};

    // Accumulate state transitions for all the given strings.
    for (const s of strings) {
      let state = start;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        const next: State = {};
        if (state[c]) {
          state[c].push(next);
        } else {
          state[c] = [next];
        }
        state = next;
      }
      state[''] = [start];
      // Anchor the pattern to the end of the string.
      state['$'] = [Matcher.accept];
    }
    return new Matcher(start);
  }
}

function log(...args: any[]) {
  console.log(...args);
}

if (require.main === module) {
  const input = fs.readFileSync(process.argv[2] ?? 'input', {encoding: 'utf8'});
  console.log(countValidPatterns(input));
}
