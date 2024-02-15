# mvp

# nice to haves
- sudoku.com line clear effect
- Report puzzle
- click and hold

# cleanup
- Better unrefs

# todo

# doing

# done
- Better concurrency
- Fix puzzle name spoiler
- Better layout for usernames
- 'no clue really' renamen naar helikoptervogel
- Is puzzle solvable?
- bug: 'hitsincolumns' could point to playfield or solution
- cursor sync is broken
- 'new puzzle' knop
- Send new puzzle after clearing
- repareer 'my puzzles'
- repareer game.vue
- Repair create puzzle
- Vote to clear
- Vote to skip
- Nicknames
- Setting X'es touchscreen
- Basic touchscreen controls
- auto-x'es indien line goed is
- Muis ook socket syncen
- optical guides
- mouse and keyboard should share same cursor

# About puzzle difficulty
https://liacs.leidenuniv.nl/~kosterswa/nonodec2012.pdf

- Only allow unambiguous, 'simple' puzzles that can be solved without branching, just with sweeps.
- Count the amount of sweeps needed to define a difficulty.
- Think about what kind of solver I need. Do I need to write one?
 -	I think I need to use a 'push solver'. This npm package has one (https://github.com/thomasr/nonogram-solver/blob/HEAD/doc/internals.md), I could wrap it so that it doesn't hang but returns false if unsuccesfull. Or write my own push solver, could be fun.
 - Looks like this guy already did it: https://github.com/SmashHighlights/nonogram-solver



## How to fix the refs issue:

- useGrid accepts dumb grid and solution arrays -> do they? They can init as empty
- Exports one 'grid' object, with methods like 'set' (with own internal clamptogrid), 'levelIsClear', 'hitsinrow'
- 'game.vue' and 'create.vue' recieve this object, and pass it to TheGrid
- This is sort of a store, actually. It doesn't feel too dirty if you think about it like that.


##Some composition references: 
https://wildermuth.com/2020/08/30/Vue-3-To-Vuex-or-Not-to-Vuex
https://andrejgaluf.com/blog/vue-composition-api-store/
https://dev.to/thomasferro/composition-api-v-renderless-components-let-s-use-vue-3-s-features-to-clean-our-components-n25
