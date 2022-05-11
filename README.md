# mvp
- Nicknames
- Is puzzle solvable?
- Send new puzzle after clearing
- Basic touchscreen controls
- Setting X'es (touschreen and mouse)
- Vote to clear
- Vote to skip

# nice to haves
- sudoku.com line clear effect
- Muis ook socket syncen
- Report puzzle
- optical guides

# cleanup
- Better unrefs

# todo
'new puzzle' knop

# doing


# done
- repareer 'my puzzles'
- repareer game.vue
- Repair create puzzle



## How to fix the refs issue:

- useGrid accepts dumb grid and solution arrays -> do they? They can init as empty
- Exports one 'grid' object, with methods like 'set' (with own internal clamptogrid), 'levelIsClear', 'hitsinrow'
- 'game.vue' and 'create.vue' recieve this object, and pass it to TheGrid
- This is sort of a store, actually. It doesn't feel too dirty if you think about it like that.


##Some composition references: 
https://wildermuth.com/2020/08/30/Vue-3-To-Vuex-or-Not-to-Vuex
https://andrejgaluf.com/blog/vue-composition-api-store/
https://dev.to/thomasferro/composition-api-v-renderless-components-let-s-use-vue-3-s-features-to-clean-our-components-n25