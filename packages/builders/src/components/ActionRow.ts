/* eslint-disable jsdoc/check-param-names */

import type {
	APITextInputComponent,
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIButtonComponent,
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { resolveBuilder } from '../util/resolveBuilder.js';
import { isValidationEnabled } from '../util/validation.js';
import { actionRowPredicate } from './Assertions.js';
import { ComponentBuilder } from './Component.js';
import type { AnyActionRowComponentBuilder } from './Components.js';
import { createComponentBuilder } from './Components.js';
import { ButtonBuilder } from './button/Button.js';
import { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';

export interface ActionRowBuilderData
	extends Partial<Omit<APIActionRowComponent<APIActionRowComponentTypes>, 'components'>> {
	components: AnyActionRowComponentBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for action rows.
 *
 * @typeParam ComponentType - The types of components this action row holds
 */
export class ActionRowBuilder extends ComponentBuilder<APIActionRowComponent<APIActionRowComponentTypes>> {
	private readonly data: ActionRowBuilderData;

	/**
	 * The components within this action row.
	 */
	public get components(): readonly AnyActionRowComponentBuilder[] {
		return this.data.components;
	}

	/**
	 * Creates a new action row from API data.
	 *
	 * @param data - The API data to create this action row with
	 * @example
	 * Creating an action row from an API data object:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Type something",
	 * 			style: TextInputStyle.Short,
	 * 			type: ComponentType.TextInput,
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating an action row using setters and API data:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Click me",
	 * 			style: ButtonStyle.Primary,
	 * 			type: ComponentType.Button,
	 * 		},
	 * 	],
	 * })
	 * 	.addComponents(button2, button3);
	 * ```
	 */
	public constructor({ components = [], ...data }: Partial<APIActionRowComponent<APIActionRowComponentTypes>> = {}) {
		super();
		this.data = {
			...structuredClone(data),
			type: ComponentType.ActionRow,
			components: components.map((component) => createComponentBuilder(component)) ?? [],
		};
	}

	/**
	 * Adds button components to this action row.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addButtonComponents(
		...input: RestOrArray<APIButtonComponent | ButtonBuilder | ((builder: ButtonBuilder) => ButtonBuilder)>
	): this {
		const normalized = normalizeArray(input);
		for (const button of normalized) {
			this.sharedAddComponent(button, ButtonBuilder);
		}

		return this;
	}

	/**
	 * Adds a channel select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addChannelSelectMenuComponent(
		input:
			| APIChannelSelectComponent
			| ChannelSelectMenuBuilder
			| ((builder: ChannelSelectMenuBuilder) => ChannelSelectMenuBuilder),
	): this {
		return this.sharedAddComponent(input, ChannelSelectMenuBuilder);
	}

	/**
	 * Adds a mentionable select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addMentionableSelectMenuComponent(
		input:
			| APIMentionableSelectComponent
			| MentionableSelectMenuBuilder
			| ((builder: MentionableSelectMenuBuilder) => MentionableSelectMenuBuilder),
	): this {
		return this.sharedAddComponent(input, MentionableSelectMenuBuilder);
	}

	/**
	 * Adds a role select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addRoleSelectMenuComponent(
		input: APIRoleSelectComponent | RoleSelectMenuBuilder | ((builder: RoleSelectMenuBuilder) => RoleSelectMenuBuilder),
	): this {
		return this.sharedAddComponent(input, RoleSelectMenuBuilder);
	}

	/**
	 * Adds a string select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addStringSelectMenuComponent(
		input:
			| APIStringSelectComponent
			| StringSelectMenuBuilder
			| ((builder: StringSelectMenuBuilder) => StringSelectMenuBuilder),
	): this {
		return this.sharedAddComponent(input, StringSelectMenuBuilder);
	}

	/**
	 * Adds a user select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addUserSelectMenuComponent(
		input: APIUserSelectComponent | UserSelectMenuBuilder | ((builder: UserSelectMenuBuilder) => UserSelectMenuBuilder),
	): this {
		return this.sharedAddComponent(input, UserSelectMenuBuilder);
	}

	/**
	 * Adds a text input component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addTextInputComponent(
		input: APITextInputComponent | TextInputBuilder | ((builder: TextInputBuilder) => TextInputBuilder),
	): this {
		return this.sharedAddComponent(input, TextInputBuilder);
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIActionRowComponent<APIActionRowComponentTypes> {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(validationOverride)),
		};

		if (validationOverride ?? isValidationEnabled()) {
			actionRowPredicate.parse(data);
		}

		return data as APIActionRowComponent<APIActionRowComponentTypes>;
	}

	/**
	 * @internal
	 */
	private sharedAddComponent<
		Component extends AnyActionRowComponentBuilder,
		ComponentData extends Record<keyof any, any>,
	>(component: Component | ComponentData | ((builder: Component) => Component), Constructor: new () => Component) {
		const resolved = resolveBuilder(component, Constructor);
		this.data.components.push(resolved);

		return this;
	}
}
