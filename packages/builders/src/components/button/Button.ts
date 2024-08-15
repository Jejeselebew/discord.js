import {
	ComponentType,
	type APIButtonComponent,
	type APIButtonComponentWithCustomId,
	type APIButtonComponentWithSKUId,
	type APIButtonComponentWithURL,
	type APIMessageComponentEmoji,
	type ButtonStyle,
	type Snowflake,
} from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';
import { buttonPredicate } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

/**
 * A builder that creates API-compatible JSON data for buttons.
 */
export class ButtonBuilder extends ComponentBuilder<APIButtonComponent> {
	private readonly data: Partial<APIButtonComponent>;

	/**
	 * Creates a new button from API data.
	 *
	 * @param data - The API data to create this button with
	 * @example
	 * Creating a button from an API data object:
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	custom_id: 'a cool button',
	 * 	style: ButtonStyle.Primary,
	 * 	label: 'Click Me',
	 * 	emoji: {
	 * 		name: 'smile',
	 * 		id: '123456789012345678',
	 * 	},
	 * });
	 * ```
	 * @example
	 * Creating a button using setters and API data:
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	style: ButtonStyle.Secondary,
	 * 	label: 'Click Me',
	 * })
	 * 	.setEmoji({ name: '🙂' })
	 * 	.setCustomId('another cool button');
	 * ```
	 */
	public constructor(data: Partial<APIButtonComponent> = {}) {
		super();
		this.data = { ...structuredClone(data), type: ComponentType.Button };
	}

	/**
	 * Sets the style of this button.
	 *
	 * @param style - The style to use
	 */
	public setStyle(style: ButtonStyle) {
		this.data.style = style;
		return this;
	}

	/**
	 * Sets the URL for this button.
	 *
	 * @remarks
	 * This method is only available to buttons using the `Link` button style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://`, and `discord://`.
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		(this.data as APIButtonComponentWithURL).url = url;
		return this;
	}

	/**
	 * Sets the custom id for this button.
	 *
	 * @remarks
	 * This method is only applicable to buttons that are not using the `Link` button style.
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		(this.data as APIButtonComponentWithCustomId).custom_id = customId;
		return this;
	}

	/**
	 * Sets the SKU id that represents a purchasable SKU for this button.
	 *
	 * @remarks Only available when using premium-style buttons.
	 * @param skuId - The SKU id to use
	 */
	public setSKUId(skuId: Snowflake) {
		(this.data as APIButtonComponentWithSKUId).sku_id = skuId;
		return this;
	}

	/**
	 * Sets the emoji to display on this button.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).emoji = emoji;
		return this;
	}

	/**
	 * Clears the emoji on this button.
	 */
	public clearEmoji() {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).emoji = undefined;
		return this;
	}

	/**
	 * Sets whether this button is disabled.
	 *
	 * @param disabled - Whether to disable this button
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * Sets the label for this button.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).label = label;
		return this;
	}

	/**
	 * Clears the label on this button.
	 */
	public clearLabel() {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).label = undefined;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIButtonComponent {
		const clone = structuredClone(this.data);

		if (validationOverride ?? isValidationEnabled()) {
			buttonPredicate.parse(clone);
		}

		return clone as APIButtonComponent;
	}
}
