const isStrangeTexture = require('./ItemName/isStrangeTexture');
const isUncraftableUnique = require('./ItemName/isUncraftableUnique');
const isUnusual = require('./ItemName/isUnusual');
const isUnique = require('./ItemName/isUnique');
const isTextureDefindex = require('./ItemName/isTextureDefindex');

/**
 * Class that handles name.
 */
class ItemName {
	constructor(item) {
		this.item = item;
		this.origin = this.getOrigin();
	}

	getOrigin() {
		return this.item.market_name || this.item.name || this.item.market_hash_name;
	}

	getShort() {
		const { resources } = require('../../index');

		const { australium, wear, killstreak,
			texture, elevated, festivized, quality } = this.item.getNameAttributes();

		let name = this.origin;

		/**
		 * If any of the resources fail
		 * You can check it thanks to this var.
		 * @type {boolean}
		 */
		let shortenedName = true;

		if (australium) name = name.replace('Australium ', '');
		if (festivized) name = name.replace('Festivized ', '');
		if (elevated) name = name.replace('Strange ', '');
		if (killstreak) name = name.replace(`${resources.getKillstreakValue(killstreak)} `, '');
		if (wear) name = name.replace(`${resources.getWearValue(wear)} `, '');

		if (isTextureDefindex(texture)) name = name.replace(`${texture} `, '');
		else shortenedName = false;

		if (isUnique(quality)) name = name.replace(/^The /, '');
		else name = name.replace(`${resources.getQualityValue(quality)} `, '');

		return { name, shortenedName };
	}

	/**
	 * Returns full name like backpack.tf
	 * @return {string}
	 */
	getFull() {
		// TODO: change with better management
		const { resources } = require('../../index');

		let name = this.origin;

		const { wear, craftable, tradable, texture, quality, effect } = this.item.getNameAttributes();

		if (wear) name = `name (${resources.getWearValue(wear)})`;

		if (effect) {
			if (isUnusual(quality)) name = name.replace('Unusual ', resources.getEffectValue(effect));
			else {
				name.replace(
					`${resources.getQualityValue(quality)} `,
					`${resources.getQualityValue(quality)} ${resources.getEffectValue(effect)}`,
				);
			}
		}

		if (isUncraftableUnique(quality, craftable)) name = name.replace(/^The /, '');

		if (isStrangeTexture(quality, texture)) name += 'Strange ';
		if (!tradable) name += 'Non-Tradable ';
		if (!craftable) name += 'Non-Craftable ';

		return name;
	}
}

module.exports = ItemName;
