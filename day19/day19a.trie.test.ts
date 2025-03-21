import { describe, it, expect } from '@jest/globals';
import { Trie, countValidPatterns } from './day19a.trie';

describe('Trie', () => {
  const trie = Trie.fromStrings(['a', 'abc', 'abcdef', 'hithere']);

  it.each([
    ['a', 'a'],
    ['abc', 'abc'],
    ['', undefined],
    ['abcdef', 'abcdef'],
    ['abcdefg', 'abcdef'],
    ['z', undefined],
  ])('finds the longest prefix for "%s"', (arg: string, want: string | undefined) => {
    const got = trie.findLongestPrefix(arg);
    expect(got).toEqual(want);
  });

  it.each([
    ['a', ['a']],
    ['abc', ['a', 'abc']],
    ['', []],
    ['abcdef', ['a', 'abc', 'abcdef']],
    ['abcdefg', ['a', 'abc', 'abcdef']],
    ['z', []],
  ])('finds the longest prefix for "%s"', (arg: string, want: string[]) => {
    const got = trie.findPrefixes(arg);
    expect(got).toEqual(want);
  });
});

describe('day19', () => {
  it('can do the example', () => {
    const exampleInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;
    expect(countValidPatterns(exampleInput)).toEqual(6);
  });
});
