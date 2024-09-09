import type { JSONEncodable } from '@discordjs/util';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

export abstract class CommandBuilder<Command extends RESTPostAPIApplicationCommandsJSONBody>
	implements JSONEncodable<Command>
{
	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public abstract toJSON(validationOverride?: boolean): Command;
}
