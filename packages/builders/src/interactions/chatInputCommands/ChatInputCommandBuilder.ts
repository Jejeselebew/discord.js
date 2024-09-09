import type { JSONEncodable } from '@discordjs/util';
import { ApplicationCommandType, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { isValidationEnabled } from '../../util/validation.js';
import { chatInputCommandPredicate } from './Assertions.js';
import { SharedChatInputCommand } from './mixins/SharedChatInputCommand.js';
import { SharedChatInputCommandOptions } from './mixins/SharedChatInputCommandOptions.js';
import { SharedNameAndDescription } from './mixins/SharedNameAndDescription.js';
import { SharedChatInputCommandSubcommands } from './mixins/SharedSubcommands.js';

/**
 * A builder that creates API-compatible JSON data for chat input commands.
 */
export class ChatInputCommandBuilder
	extends Mixin(
		SharedChatInputCommandOptions,
		SharedNameAndDescription,
		SharedChatInputCommandSubcommands,
		SharedChatInputCommand,
	)
	implements JSONEncodable<RESTPostAPIChatInputApplicationCommandsJSONBody>
{
	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): RESTPostAPIChatInputApplicationCommandsJSONBody {
		const { options, ...rest } = this.data;

		const data: RESTPostAPIChatInputApplicationCommandsJSONBody = {
			...structuredClone(rest as Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, 'options'>),
			type: ApplicationCommandType.ChatInput,
			options: options?.map((option) => option.toJSON(validationOverride)),
		};

		if (validationOverride ?? isValidationEnabled()) {
			chatInputCommandPredicate.parse(data);
		}

		return data;
	}
}
