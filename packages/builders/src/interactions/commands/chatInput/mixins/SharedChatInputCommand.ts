import type {
	ApplicationIntegrationType,
	InteractionContextType,
	Permissions,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { RestOrArray } from '../../../../util/normalizeArray.js';
import { normalizeArray } from '../../../../util/normalizeArray.js';

export interface SharedChatInputCommandData
	extends Partial<
		Pick<
			RESTPostAPIChatInputApplicationCommandsJSONBody,
			'contexts' | 'default_member_permissions' | 'integration_types' | 'nsfw'
		>
	> {}

/**
 * This mixin holds symbols that can be shared in chat input commands independent of options or subcommands.
 */
export class SharedChatInputCommand {
	protected declare readonly data: SharedChatInputCommandData;

	/**
	 * Sets the contexts of this command.
	 *
	 * @param contexts - The contexts
	 */
	public setContexts(...contexts: RestOrArray<InteractionContextType>) {
		this.data.contexts = normalizeArray(contexts);
		return this;
	}

	/**
	 * Sets the integration types of this command.
	 *
	 * @param integrationTypes - The integration types
	 */
	public setIntegrationTypes(...integrationTypes: RestOrArray<ApplicationIntegrationType>) {
		this.data.integration_types = normalizeArray(integrationTypes);
		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run the command.
	 *
	 * @remarks
	 * You can set this to `'0'` to disable the command by default.
	 * @param permissions - The permissions bit field to set
	 * @see {@link https://discord.com/developers/docs/interactions/application-commands#permissions}
	 */
	public setDefaultMemberPermissions(permissions: Permissions | bigint | number) {
		this.data.default_member_permissions = typeof permissions === 'string' ? permissions : permissions.toString();
		return this;
	}

	/**
	 * Clears the default permissions a member should have in order to run the command.
	 */
	public clearDefaultMemberPermissions() {
		this.data.default_member_permissions = undefined;
		return this;
	}

	/**
	 * Sets whether this command is NSFW.
	 *
	 * @param nsfw - Whether this command is NSFW
	 */
	public setNSFW(nsfw = true) {
		this.data.nsfw = nsfw;
		return this;
	}
}
