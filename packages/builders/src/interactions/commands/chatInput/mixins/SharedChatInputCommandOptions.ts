import { resolveBuilder } from '../../../../util/resolveBuilder.js';
import { ChatInputCommandAttachmentOption } from '../options/attachment.js';
import { ChatInputCommandBooleanOption } from '../options/boolean.js';
import { ChatInputCommandChannelOption } from '../options/channel.js';
import { ChatInputCommandIntegerOption } from '../options/integer.js';
import { ChatInputCommandMentionableOption } from '../options/mentionable.js';
import { ChatInputCommandNumberOption } from '../options/number.js';
import { ChatInputCommandRoleOption } from '../options/role.js';
import { ChatInputCommandStringOption } from '../options/string.js';
import { ChatInputCommandUserOption } from '../options/user.js';
import type { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

export interface SharedChatInputCommandOptions {
	options?: ApplicationCommandOptionBase[];
}
/**
 * This mixin holds symbols that can be shared in chat input command options.
 *
 * @typeParam TypeAfterAddingOptions - The type this class should return after adding an option.
 */
export class SharedChatInputCommandOptions {
	protected declare readonly data: SharedChatInputCommandOptions;

	/**
	 * Adds a boolean option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addBooleanOption(
		input: ChatInputCommandBooleanOption | ((builder: ChatInputCommandBooleanOption) => ChatInputCommandBooleanOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandBooleanOption);
	}

	/**
	 * Adds a user option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addUserOption(
		input: ChatInputCommandUserOption | ((builder: ChatInputCommandUserOption) => ChatInputCommandUserOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandUserOption);
	}

	/**
	 * Adds a channel option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addChannelOption(
		input: ChatInputCommandChannelOption | ((builder: ChatInputCommandChannelOption) => ChatInputCommandChannelOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandChannelOption);
	}

	/**
	 * Adds a role option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addRoleOption(
		input: ChatInputCommandRoleOption | ((builder: ChatInputCommandRoleOption) => ChatInputCommandRoleOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandRoleOption);
	}

	/**
	 * Adds an attachment option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addAttachmentOption(
		input:
			| ChatInputCommandAttachmentOption
			| ((builder: ChatInputCommandAttachmentOption) => ChatInputCommandAttachmentOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandAttachmentOption);
	}

	/**
	 * Adds a mentionable option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addMentionableOption(
		input:
			| ChatInputCommandMentionableOption
			| ((builder: ChatInputCommandMentionableOption) => ChatInputCommandMentionableOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandMentionableOption);
	}

	/**
	 * Adds a string option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addStringOption(
		input: ChatInputCommandStringOption | ((builder: ChatInputCommandStringOption) => ChatInputCommandStringOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandStringOption);
	}

	/**
	 * Adds an integer option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addIntegerOption(
		input: ChatInputCommandIntegerOption | ((builder: ChatInputCommandIntegerOption) => ChatInputCommandIntegerOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandIntegerOption);
	}

	/**
	 * Adds a number option.
	 *
	 * @param input - A function that returns an option builder or an already built builder
	 */
	public addNumberOption(
		input: ChatInputCommandNumberOption | ((builder: ChatInputCommandNumberOption) => ChatInputCommandNumberOption),
	) {
		return this.sharedAddOption(input, ChatInputCommandNumberOption);
	}

	/**
	 * Where the actual adding magic happens. ✨
	 *
	 * @param input - The input. What else?
	 * @param Instance - The instance of whatever is being added
	 * @internal
	 */
	private sharedAddOption<OptionBuilder extends ApplicationCommandOptionBase>(
		input: OptionBuilder | ((builder: OptionBuilder) => OptionBuilder),
		Instance: new () => OptionBuilder,
	): this {
		this.data.options ??= [];

		const result = resolveBuilder(input, Instance);
		this.data.options.push(result);

		return this;
	}
}
