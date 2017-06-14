
const Randomly = require('weighted-randomly-select');
const compact = require('lodash.compact');
const random = require('lodash.random');
const cloneDeep = require('lodash.clonedeep');

module.exports.LootFunctions = {
    WithReplacement: 'chooseWithReplacement',
    WithoutReplacement: 'chooseWithoutReplacement',
    EachItem: 'tryToDropEachItem'
};

module.exports.LootRoller = class LootRoller {

    static rollTables(lootTableConfigs) {
        const items = [];
        lootTableConfigs.forEach(({ table, func, args }) => {
            items.push(...table[func](args));
        });
        return items;
    }

    static rollTable(lootTableConfig) {
        return this.rollTables([lootTableConfig]);
    }

};

module.exports.LootTable = class LootTable {
    constructor(choices, { rollModifier } = {}) {
        this.choices = this._configureChoices(choices);
        this.rollModifier = rollModifier || 0;
    }

    _prepareArray() {
        const alwaysDrop = [];
        const choices = compact(cloneDeep(this.choices).map(x => {
            if(x.chance <= 0) {
                alwaysDrop.push(x.result);
                return null;
            }
            x.chance += this.rollModifier;
            return x;
        }));

        return { alwaysDrop, choices };
    }

    _configureChoices(choices) {
        // pre-formatted with weights
        if(choices[0].chance) return choices;

        // assign a weight of 1 to everything
        return choices.map(item => ({ result: item, chance: 1 }));
    }

    chooseWithReplacement(numItems = 1) {
        const { choices, alwaysDrop } = this._prepareArray(this.choices);
        return alwaysDrop.concat(Array(numItems).fill(null).map(() => Randomly.select(choices)));
    }

    chooseWithoutReplacement(numItems = 1) {
        let { choices, alwaysDrop } = this._prepareArray(this.choices);

        if(numItems > choices.length) throw new Error(`Cannot choose ${numItems} without replacement when array is only ${choices.length} choices.`);

        return alwaysDrop.concat(Array(numItems).fill(null).map(() => {
            const choice = Randomly.select(choices);
            choices = choices.filter(({ result }) => result !== choice);
            return choice;
        }));
    }

    tryToDropEachItem(comparisonValue) {
        const { choices, alwaysDrop } = this._prepareArray(this.choices);

        return alwaysDrop.concat(compact(choices.map(({ result, chance, maxChance }) => {
            const randomValue = random(0, maxChance || comparisonValue || 1);
            if(chance >= randomValue) return result;
            return null;
        })));
    }
};