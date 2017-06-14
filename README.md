# Lootastic

A simple and flexible loot rolling system.

## Install
`npm i lootastic`

## Usage

You can create a LootTable with:

* a plain array (all item weights will be set to 1)
* an array with objects formatted like `{ chance: X, result: <item> }`

You can also pass in a `rollModifier` into the options object to increase the weights of every item.

Examples:

```
// plain initialization - all weights are 1
let lootTable = new LootTable(['sword', 'armor', 'potion', 'shield']);

// weight initialization - swords are common, potions are not
let lootTable = new LootTable([
    { chance: 1, result: 'potion' },
    { chance: 5, result: 'armor' },
    { chance: 10, result: 'shield' },
    { chance: 20, result: 'sword' }
]);

// weight initialization with a rollModifier - each weight is 10 higher
// a common use-case here is a "luck bonus" in item drops
let lootTable = new LootTable([
    { chance: 1, result: 'potion' },
    { chance: 5, result: 'armor' },
    { chance: 10, result: 'shield' },
    { chance: 20, result: 'sword', maxChance: 100 }, // always a 1/5 drop rate
    { chance: -1, result: 'gold' } // always drops
], { rollModifier: 10 });
```

You can roll a table using one of 3 methods:

* choose X items with replacement
* choose X items without replacement
* try to roll for each item in the table using a chance/X probability (where X would be something like 1/10000)

Examples:
```
let result = lootTable.chooseWithReplacement(1) // 1 random item + gold
let result = lootTable.chooseWithReplacement(5) // 5 random items + gold

let result = lootTable.chooseWithoutReplacement(1) // 1 random item + gold
let result = lootTable.chooseWithoutReplacement(4) // the whole table + gold
let result = lootTable.chooseWithoutReplacement(5) // error - not enough items to choose

let result = lootTable.tryToDropEachItem(1) // all items will drop + gold
let result = lootTable.tryToDropEachItem(10) // shield and sword will guaranteed drop + gold
let result = lootTable.tryToDropEachItem(100) // some items might drop + gold
```

If you want to roll multiple loot tables at once, or the same loot table multiple times (suppose you have a monster drop table and a zone drop table), you can use the LootRoller class:

```
let result = LootRoller.rollTables([

    { table: lootTable, func: LootFunctions.WithoutReplacement, args: 1 }, // always picks 1 item (+ gold)
    { table: lootTable, func: LootFunctions.EachItem, args: 1 }, // try to drop each item (+ gold)

]); // 2 gold entries, 1 item, and maybe more depending on the EachItem roll
```

## Usage Notes

* You can add a property `maxChance` to an item to customize `tryToDropForEachItem` when you don't want to scale item probabilities.
* You can specify a weight of -1 to tell an item to always drop in addition to other random drops.
* Use plain objects, not classes, since the data is cloned when rolling loot.