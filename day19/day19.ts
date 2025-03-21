import * as fs from 'fs';

function partOne(input: string): number {
  const [towels, patterns] = parseInput(input);
  return patterns.reduce((sum, p) => {
    return sum + (countPatternSolutions(towels, p) > 0 ? 1 : 0);
  }, 0);
}

function partTwo(input: string): number {
  const [towels, patterns] = parseInput(input);
  return patterns.reduce((sum, p) => {
    return sum + countPatternSolutions(towels, p)
  }, 0);
}

function parseInput(s: string): [string[], string[]] {
  const lines = s.trim().split(/\n/);
  const towels = lines[0].split(/, /);
  const patterns = lines.slice(2);
  return [towels, patterns];
}

function countPatternSolutions(towels: string[], pattern: string) {
  const countFor: Map<string, number> = new Map();

  // Count the number of ways we can reach the end of the pattern, and cache
  // the result for each sub-pattern.
  const count = (subPattern: string): number => {
    if (countFor.has(subPattern)) {
      return countFor.get(subPattern)!;
    }
    if (subPattern === '') {
      return 1;
    }

    let sum = 0;
    for (const towel of towels) {
      if (subPattern.startsWith(towel)) {
        sum += count(subPattern.slice(towel.length));
      }
    }
    countFor.set(subPattern, sum);
    return sum;
  };
  return count(pattern);
}

if (require.main === module) {
  const usage = 'day19 partOne|partTwo <inputFile>'
  const args = process.argv.slice(2);
  if (args.length != 2) {
    console.error(usage)
    process.exit(1);
  }
  const [part, inputFile] = args;

  const input = fs.readFileSync(inputFile, {encoding: 'utf8'});
  if (part === 'partOne') {
    console.log(partOne(input));
  } else if (part === 'partTwo') {
    console.log(partTwo(input));
  } else {
    console.error(`unexpected part: ${part}`);
    process.exit(1);
  }
}
