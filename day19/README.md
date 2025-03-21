# Part One

## DFS, using a trie to pick towels

My first thought was to do a depth-first search, greedily choosing towels that match the longest prefix of the remaining pattern, but if I had spent a bit more time thinking about the runtime complexity, I probably would have avoided implementing this approach. If we think about a worst case where the towels only have one stripe and only eat one character of the pattern at a time, then even if we only have 2 towels, our search will be O(2^m) (m: pattern length), so patterns much longer than 32 won't be feasible to search, and some of the ones in the input are ~60.

## Using V8's non-backtracking regex engine

Some of the patterns in my input can cause lots of backtracking, so building a regex as a string out of the towels hits a wall with the default NFA regex engine. However, as announced at [An additional non-backtracking RegExp engine](https://v8.dev/blog/non-backtracking-regexp), V8 includes a non-backtracking regex engine, which Node supports access to via the `l` RegExp flag ([Support non backtracking regexp (/L flag) · Issue #38297 · nodejs/node](https://github.com/nodejs/node/issues/38297)) when the `--enable-experimental-regexp-engine` is given. With the `l` flag `day19a.v8regex.ts` tests all the patterns in ~0.2s on my machine.

## Building a Thompson NFA

Since we're dealing with pretty simple expressions here, I was wondering if I could build a DFA directly out of `character -> nextState` objects, working my way through each string like `bwu -> {b: {w: {u: ...}}}` , keeping track of the start state and end states, and then connecting the end states to everything that the start state connected to, but soon I realized that'd overwrite some edges; we'd need to make some new states when joining the machines for the individual strings in order to keep the whole thing a DFA. There's probably a good reason why everyone seems to build an NFA first before converting it to a DFA. But instead of doing that conversion, it seems easier to do a Thompson-style simulation on an NFA where instead of backtracking you keep track of multiple current states; it has slightly worse runtime of O(mn) (m: haystack length, n: regex length) compared to O(n) for a DFA, but that seems fine in this case as it still runs in about a second.

# Part Two

My approaches for part one weren't suitable for part two. When doing a Thompson simulation of an NFA you dedupe your next states, which probably precludes counting the number of ways you can traverse it. I'm not convinced it's impossible, but in my attempts my list of next states was blowing up.

Since you can reduce the size of the problem by removing a towel/prefix from the pattern, a recursive decrease-and-conquer approach works well, in particular because you can cache results from right-to-left to significantly cut down the amount of backtracking. My initial DFS approach wasn't suitable for part two since there are no intermediate results that are useful to cache.
