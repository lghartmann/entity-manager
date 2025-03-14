Hi! I've made this simple package for frontend intended use, when you deal with frontend state management in some layouts the logic can get messy.

Developing this simple library i thought of every action being "undoable" and the original state going back to original, if you find any problem please create an issue.

`addEntity` is a function that takes an argument entity (of type `T` or `Y`), i designed it this way because sometimes the 2 lists shown in the screen might not share the same exact type.

`removeEntity` is a function that takes an argument entity (of type `T` or `Y`), i designed it this way because sometimes the 2 lists shown in the screen might not share the same exact type.

Internally `addEntity` verifies first if the entity is already inside the exposed `removedEntities` array, if it is, the item inside `removedEntities` is removed and the item goes back to the list it belonged.
If the item is NOT inside the exposed `removedEntities` array we remove the item from the `freeEntities` array and push it to `addedEntities`.

Internally `removeEntity` verifies first if the entity is already inside the exposed `addedEntities` array, if it is, the item inside `addedEntities` is removed and the item goes back to the list it belonged.
If the item is NOT inside the exposed `addedEntities` array we remove the item from the `relatedEntities` array and push it to the exposed `removedEntities`.
