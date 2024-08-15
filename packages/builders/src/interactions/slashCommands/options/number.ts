import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { numberOptionPredicate } from '../Assertions.js';
import { ApplicationCommandNumericOptionMinMaxValueMixin } from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin.js';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase.js';
import { ApplicationCommandOptionWithAutocompleteMixin } from '../mixins/ApplicationCommandOptionWithAutocompleteMixin.js';
import { ApplicationCommandOptionWithChoicesMixin } from '../mixins/ApplicationCommandOptionWithChoicesMixin.js';

/**
 * A slash command number option.
 */
export class SlashCommandNumberOption extends Mixin(
	ApplicationCommandOptionBase,
	ApplicationCommandNumericOptionMinMaxValueMixin,
	ApplicationCommandOptionWithAutocompleteMixin,
	ApplicationCommandOptionWithChoicesMixin<number>,
) {
	protected override readonly predicate = numberOptionPredicate;

	public constructor() {
		super(ApplicationCommandOptionType.Number);
	}
}
