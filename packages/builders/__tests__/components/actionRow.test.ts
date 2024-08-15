import {
	ButtonStyle,
	ComponentType,
	type APIActionRowComponent,
	type APIMessageActionRowComponent,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import {
	ActionRowBuilder,
	ButtonBuilder,
	createComponentBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from '../../src/index.js';

const rowWithButtonData: APIActionRowComponent<APIMessageActionRowComponent> = {
	type: ComponentType.ActionRow,
	components: [
		{
			type: ComponentType.Button,
			label: 'test',
			custom_id: '123',
			style: ButtonStyle.Primary,
		},
	],
};

const rowWithSelectMenuData: APIActionRowComponent<APIMessageActionRowComponent> = {
	type: ComponentType.ActionRow,
	components: [
		{
			type: ComponentType.StringSelect,
			custom_id: '1234',
			options: [
				{
					label: 'one',
					value: 'one',
				},
				{
					label: 'two',
					value: 'two',
				},
			],
			max_values: 10,
			min_values: 12,
		},
	],
};

describe('Action Row Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid components THEN do not throw', () => {
			expect(() =>
				new ActionRowBuilder().addButtonComponents(new ButtonBuilder(), new ButtonBuilder()),
			).not.toThrowError();
			expect(() => new ActionRowBuilder().addButtonComponents([new ButtonBuilder()])).not.toThrowError();
		});

		test('GIVEN valid JSON input THEN valid JSON output is given', () => {
			const actionRowData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: 'button',
						style: ButtonStyle.Primary,
						custom_id: 'test',
					},
					{
						type: ComponentType.Button,
						label: 'link',
						style: ButtonStyle.Link,
						url: 'https://google.com',
					},
				],
			};

			expect(new ActionRowBuilder(actionRowData).toJSON()).toEqual(actionRowData);
			expect(() => createComponentBuilder({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given', () => {
			const rowWithButtonData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						label: 'test',
						custom_id: '123',
						style: ButtonStyle.Primary,
					},
				],
			};

			const rowWithSelectMenuData: APIActionRowComponent<APIMessageActionRowComponent> = {
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.StringSelect,
						custom_id: '1234',
						options: [
							{
								label: 'one',
								value: 'one',
							},
							{
								label: 'two',
								value: 'two',
							},
						],
						max_values: 10,
						min_values: 12,
					},
				],
			};

			expect(new ActionRowBuilder(rowWithButtonData).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder(rowWithSelectMenuData).toJSON()).toEqual(rowWithSelectMenuData);
			expect(() => createComponentBuilder({ type: ComponentType.ActionRow, components: [] })).not.toThrowError();
		});

		test('GIVEN valid builder options THEN valid JSON output is given 2', () => {
			const button = new ButtonBuilder().setLabel('test').setStyle(ButtonStyle.Primary).setCustomId('123');
			const selectMenu = new StringSelectMenuBuilder()
				.setCustomId('1234')
				.setMaxValues(10)
				.setMinValues(12)
				.setOptions(
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				)
				.setOptions([
					new StringSelectMenuOptionBuilder().setLabel('one').setValue('one'),
					new StringSelectMenuOptionBuilder().setLabel('two').setValue('two'),
				]);

			expect(new ActionRowBuilder().addButtonComponents(button).toJSON()).toEqual(rowWithButtonData);
			expect(new ActionRowBuilder().addStringSelectMenuComponent(selectMenu).toJSON()).toEqual(rowWithSelectMenuData);
			expect(new ActionRowBuilder().addButtonComponents([button]).toJSON()).toEqual(rowWithButtonData);
		});
	});
});
