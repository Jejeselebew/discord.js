import {
	ButtonStyle,
	ComponentType,
	type APIButtonComponentWithCustomId,
	type APIButtonComponentWithURL,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { ButtonBuilder } from '../../src/components/button/Button.js';

const buttonComponent = () => new ButtonBuilder();

const longStr =
	'looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong';

describe('Button Components', () => {
	describe('Assertion Tests', () => {
		test('GIVEN valid fields THEN builder does not throw', () => {
			expect(() =>
				buttonComponent().setCustomId('custom').setStyle(ButtonStyle.Primary).setLabel('test'),
			).not.toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setCustomId('custom')
					.setLabel('test')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
					.setEmoji({ name: 'test' });

				button.toJSON();
			}).not.toThrowError();

			expect(() => {
				const button = buttonComponent().setSKUId('123456789012345678').setStyle(ButtonStyle.Premium);
				button.toJSON();
			}).not.toThrowError();

			expect(() => buttonComponent().setURL('https://google.com')).not.toThrowError();
		});

		test('GIVEN invalid fields THEN build does throw', () => {
			expect(() => {
				buttonComponent().setCustomId(longStr).toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setCustomId('custom')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
					.setLabel('test')
					.setURL('https://google.com')
					.setEmoji({ name: 'test' });

				button.toJSON();
			}).toThrowError();

			expect(() => {
				// @ts-expect-error: Invalid emoji
				const button = buttonComponent().setEmoji('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary);
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary).setCustomId('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Link);
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary).setLabel('test').setURL('https://google.com');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Link).setLabel('test');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent().setStyle(ButtonStyle.Primary).setSKUId('123456789012345678');
				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setStyle(ButtonStyle.Secondary)
					.setLabel('button')
					.setSKUId('123456789012345678');

				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setStyle(ButtonStyle.Success)
					.setEmoji({ name: '😇' })
					.setSKUId('123456789012345678');

				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setStyle(ButtonStyle.Danger)
					.setCustomId('test')
					.setSKUId('123456789012345678');

				button.toJSON();
			}).toThrowError();

			expect(() => {
				const button = buttonComponent()
					.setStyle(ButtonStyle.Link)
					.setURL('https://google.com')
					.setSKUId('123456789012345678');

				button.toJSON();
			}).toThrowError();

			// @ts-expect-error: Invalid style
			expect(() => buttonComponent().setCustomId('hi').setStyle(24).toJSON()).toThrowError();
			expect(() => buttonComponent().setCustomId('hi').setLabel(longStr).toJSON()).toThrowError();
			// @ts-expect-error: Invalid parameter for disabled
			expect(() => buttonComponent().setCustomId('hi').setDisabled(0).toJSON()).toThrowError();
			// @ts-expect-error: Invalid emoji
			expect(() => buttonComponent().setCustomId('hi').setEmoji('foo').toJSON()).toThrowError();

			expect(() => buttonComponent().setCustomId('hi').setURL('foobar').toJSON()).toThrowError();
		});

		test('GiVEN valid input THEN valid JSON outputs are given', () => {
			const interactionData: APIButtonComponentWithCustomId = {
				type: ComponentType.Button,
				custom_id: 'test',
				label: 'test',
				style: ButtonStyle.Primary,
				disabled: true,
			};

			expect(new ButtonBuilder(interactionData).toJSON()).toEqual(interactionData);

			expect(
				buttonComponent()
					.setCustomId(interactionData.custom_id)
					.setLabel(interactionData.label!)
					.setStyle(interactionData.style)
					.setDisabled(interactionData.disabled)
					.toJSON(),
			).toEqual(interactionData);

			const linkData: APIButtonComponentWithURL = {
				type: ComponentType.Button,
				label: 'test',
				style: ButtonStyle.Link,
				disabled: true,
				url: 'https://google.com',
			};

			expect(new ButtonBuilder(linkData).toJSON()).toEqual(linkData);

			expect(buttonComponent().setLabel(linkData.label!).setDisabled(true).setURL(linkData.url));
		});
	});
});
