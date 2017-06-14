
const { LootTable, LootRoller, LootFunctions } = require('../src/index');

const equalWeight = ['apple', 'banana', 'cherry', 'strawberry'];

const equalWeightTable = new LootTable(equalWeight);

console.log('equal weight');
console.log(equalWeightTable.chooseWithReplacement(1));
console.log(equalWeightTable.chooseWithReplacement(3));
console.log(equalWeightTable.chooseWithoutReplacement(1));

// drops 3/4 of the table
console.log(equalWeightTable.chooseWithoutReplacement(3));

// always drops everything
console.log(equalWeightTable.chooseWithoutReplacement(4));

// always drops everything
console.log(equalWeightTable.tryToDropEachItem(1));

// might drop 1 if lucky
console.log(equalWeightTable.tryToDropEachItem(10));

// will probably never drop anything
console.log(equalWeightTable.tryToDropEachItem(100));

const diffWeight = [
    { chance: 10, result: 'sword' },
    { chance: 1,  result: 'potion' },
    { chance: 5,  result: 'shield' },
    { chance: 20, result: 'armor' }
];

const diffWeightTable = new LootTable(diffWeight);

console.log('diff weight');
console.log(diffWeightTable.chooseWithReplacement(1));
console.log(diffWeightTable.chooseWithReplacement(3));
console.log(diffWeightTable.chooseWithoutReplacement(1));
console.log(diffWeightTable.chooseWithoutReplacement(3));
console.log(diffWeightTable.chooseWithoutReplacement(4));

// always drops everything
console.log(diffWeightTable.tryToDropEachItem(1));

// will always drop at least the sword and armor. shield and potion maybe
console.log(diffWeightTable.tryToDropEachItem(10));

// might drop armor, if lucky.
console.log(diffWeightTable.tryToDropEachItem(100));

// +10 to all rolls here
const luckModifiedTable = new LootTable(diffWeight, { rollModifier: 10 });

console.log('luck modified');
console.log(luckModifiedTable.chooseWithReplacement(1));
console.log(luckModifiedTable.chooseWithReplacement(3));
console.log(luckModifiedTable.chooseWithoutReplacement(1));
console.log(luckModifiedTable.chooseWithoutReplacement(3));
console.log(luckModifiedTable.chooseWithoutReplacement(4));

// always drops everything
console.log(luckModifiedTable.tryToDropEachItem(1));

// will always drop at least the sword and armor. potion maybe, shield likely
console.log(luckModifiedTable.tryToDropEachItem(20));

// might drop armor, if lucky.
console.log(luckModifiedTable.tryToDropEachItem(100));

console.log('loot roller');
console.log(LootRoller.rollTable({ table: luckModifiedTable, func: LootFunctions.EachItem, args: 100 }));

const tables = [
    { table: luckModifiedTable, func: LootFunctions.WithoutReplacement, args: 3 },
    { table: diffWeightTable, func: LootFunctions.WithReplacement, args: 1 },
    { table: equalWeightTable, func: LootFunctions.EachItem, args: 5 }
];

console.log(LootRoller.rollTables(tables));