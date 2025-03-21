import * as fs from 'fs';

export function countValidPatterns(input: string): number {
  const start = process.hrtime.bigint();
  const [towels, patterns] = parseInput(input);
  const trie = Trie.fromStrings(towels);
  return patterns.reduce((sum, pattern) => {
    const elapsedSecs = Number(process.hrtime.bigint() - start) / 1e9;
    log('%d: %s', elapsedSecs, pattern);
    return sum + (isPatternValid(trie, pattern) ? 1 : 0);
  }, 0);
}

export function sumOfSolutions(input: string): number {
  const start = process.hrtime.bigint();
  const [towels, patterns] = parseInput(input);
  const trie = Trie.fromStrings(towels);
  return patterns.reduce((sum, pattern) => {
    const elapsedSecs = Number(process.hrtime.bigint() - start) / 1e9;
    log('%d: %s', elapsedSecs, pattern);
    return sum + countSolutions(trie, pattern);
  }, 0);
}

function parseInput(s: string): [string[], string[]] {
  const lines = s.trim().split(/\n/);
  const towels = lines[0].split(/, /);
  const patterns = lines.slice(2);
  return [towels, patterns];
}

export function countSolutions(allTowels: Trie, pattern: string): number {
  let nSolutions = 0;
  const seq: string[] = []

  const search = (): void => {
    const lenDone = seq.reduce((sum, s) => sum + s.length, 0);
    if (lenDone === pattern.length) {
      nSolutions++;
    }
    const remaining = pattern.slice(lenDone);
    const prefixes = allTowels.findPrefixes(remaining)
      .sort((a, b) => b.length - a.length);
    for (const prefix of prefixes) {
      seq.push(prefix);
      search()
      seq.pop();
    }
  };

  search();

  return nSolutions;
}

export function isPatternValid(allTowels: Trie, pattern: string): boolean {
  const seq: string[] = []

  const search = (): boolean => {
    const lenDone = seq.reduce((sum, s) => sum + s.length, 0);
    if (lenDone === pattern.length) {
      return true;
    }
    const remaining = pattern.slice(lenDone);
    const prefixes = allTowels.findPrefixes(remaining)
      .sort((a, b) => b.length - a.length);
    for (const prefix of prefixes) {
      seq.push(prefix);

      if (search()) {
        return true;
      }

      seq.pop();
    }
    return false;
  };
  return search();
}


export class Trie {
  children: Record<string, Trie> = {};
  value: string | undefined = undefined;

  static fromStrings(values: string[]): Trie {
    const trie = new Trie();
    for (const v of values) {
      trie.add(v);
    }
    return trie;
  }

  add(s: string): void {
    return this._add(s, 0);
  }

  findLongestPrefix(s: string): string | undefined {
    if (s === '') {
      return this.value;
    }
    return this.children[s[0]]?.findLongestPrefix(s.slice(1)) ?? this.value;
  }

  findPrefixes(s: string): string[] {
    const prefixes: string[] = [];
    for (let i = 0, cur: Trie = this; cur && i <= s.length; i++) {
      if (cur.value) {
        prefixes.push(cur.value);
      }
      cur = cur.children[s[i]];
    }
    return prefixes;
  }

  private _add(s: string, i: number): void {
    if (i === s.length) {
      this.value = s;
      return;
    }
    const c = s[i];
    if (!this.children[c]) {
      this.children[c] = new Trie();
    }
    this.children[c]._add(s, i + 1);
  }

}

function log(...args: any[]) {
  //console.log(...args);
}

if (require.main === module) {
  const input = fs.readFileSync(process.argv[2] ?? 'input', {encoding: 'utf8'});
  console.log(sumOfSolutions(input));
}
