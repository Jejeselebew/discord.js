import {
	ChatInputCommandSubcommandBuilder,
	ChatInputCommandSubcommandGroupBuilder,
} from '../ChatInputCommandSubcommands.js';

export interface SharedChatInputCommandSubcommandsData {
	options?: (ChatInputCommandSubcommandBuilder | ChatInputCommandSubcommandGroupBuilder)[];
}

/**
 * This mixin holds symbols that can be shared in chat input subcommands.
 *
 * @typeParam TypeAfterAddingSubcommands - The type this class should return after adding a subcommand or subcommand group.
 */
export class SharedChatInputCommandSubcommands {
	protected declare readonly data: SharedChatInputCommandSubcommandsData;

	/**
	 * Adds a new subcommand group to this command.
	 *
	 * @param input - A function that returns a subcommand group builder or an already built builder
	 */
	public addSubcommandGroup(
		input:
			| ChatInputCommandSubcommandGroupBuilder
			| ((subcommandGroup: ChatInputCommandSubcommandGroupBuilder) => ChatInputCommandSubcommandGroupBuilder),
	): this {
		this.data.options ??= [];

		const result = typeof input === 'function' ? input(new ChatInputCommandSubcommandGroupBuilder()) : input;
		this.data.options.push(result);

		return this;
	}

	/**
	 * Adds a new subcommand to this command.
	 *
	 * @param input - A function that returns a subcommand builder or an already built builder
	 */
	public addSubcommand(
		input:
			| ChatInputCommandSubcommandBuilder
			| ((subcommandGroup: ChatInputCommandSubcommandBuilder) => ChatInputCommandSubcommandBuilder),
	): this {
		this.data.options ??= [];

		const result = typeof input === 'function' ? input(new ChatInputCommandSubcommandBuilder()) : input;
		this.data.options.push(result);

		return this;
	}
}
