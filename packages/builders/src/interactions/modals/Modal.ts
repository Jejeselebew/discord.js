/* eslint-disable jsdoc/check-param-names */

import type { JSONEncodable } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { ActionRowBuilder } from '../../components/ActionRow.js';
import { createComponentBuilder } from '../../components/Components.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { isValidationEnabled } from '../../util/validation.js';
import { modalPredicate } from './Assertions.js';

export interface ModalBuilderData extends Partial<Omit<APIModalInteractionResponseCallbackData, 'components'>> {
	components: ActionRowBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for modals.
 */
export class ModalBuilder implements JSONEncodable<APIModalInteractionResponseCallbackData> {
	/**
	 * The API data associated with this modal.
	 */
	private readonly data: ModalBuilderData;

	/**
	 * The components within this modal.
	 */
	public get components(): readonly ActionRowBuilder[] {
		return this.data.components;
	}

	/**
	 * Creates a new modal from API data.
	 *
	 * @param data - The API data to create this modal with
	 */
	public constructor({ components = [], ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = {
			...structuredClone(data),
			components: components.map((component) => createComponentBuilder(component)),
		};
	}

	/**
	 * Sets the title of this modal.
	 *
	 * @param title - The title to use
	 */
	public setTitle(title: string) {
		this.data.title = title;
		return this;
	}

	/**
	 * Sets the custom id of this modal.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Adds action rows to this modal.
	 *
	 * @param components - The components to add
	 */
	public addActionRows(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIModalActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	) {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((component) => {
			if (component instanceof ActionRowBuilder) {
				return component;
			}

			if (typeof component === 'function') {
				return component(new ActionRowBuilder());
			}

			return new ActionRowBuilder(component);
		});

		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Sets the action rows for this modal.
	 *
	 * @param components - The components to set
	 */
	public setActionRows(...components: RestOrArray<ActionRowBuilder>) {
		this.data.components.splice(0, this.data.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIModalInteractionResponseCallbackData {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(validationOverride)),
		};

		if (validationOverride ?? isValidationEnabled()) {
			modalPredicate.parse(data);
		}

		return data as APIModalInteractionResponseCallbackData;
	}
}
