import type {
	ApplicationCommandType,
	ApplicationIntegrationType,
	InteractionContextType,
	LocaleString,
	Permissions,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import type { RestOrArray } from '../../../util/normalizeArray.js';
import { normalizeArray } from '../../../util/normalizeArray.js';
import { CommandBuilder } from '../Command.js';

/**
 * The type a context menu command can be.
 */
export type ContextMenuCommandType = ApplicationCommandType.Message | ApplicationCommandType.User;

/**
 * A builder that creates API-compatible JSON data for context menu commands.
 */
export abstract class ContextMenuCommandBuilder extends CommandBuilder<RESTPostAPIContextMenuApplicationCommandsJSONBody> {
	protected readonly data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody>;

	public constructor(data: Partial<RESTPostAPIContextMenuApplicationCommandsJSONBody> = {}) {
		super();
		this.data = structuredClone(data);
	}

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
	 * Sets integration types of this command.
	 *
	 * @param integrationTypes - The integration types
	 */
	public setIntegrationTypes(...integrationTypes: RestOrArray<ApplicationIntegrationType>) {
		this.data.integration_types = normalizeArray(integrationTypes);
		return this;
	}

	/**
	 * Sets the name of this command.
	 *
	 * @param name - The name to use
	 */
	public setName(name: string) {
		this.data.name = name;
		return this;
	}

	/**
	 * Sets the default permissions a member should have in order to run this command.
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
	 * Clears the default permissions for this command.
	 */
	public clearDefaultMemberPermissions() {
		this.data.default_member_permissions = undefined;
		return this;
	}

	/**
	 * Sets a name localization for this command.
	 *
	 * @param locale - The locale to set
	 * @param localizedName - The localized name for the given `locale`
	 */
	public setNameLocalization(locale: LocaleString, localizedName: string) {
		this.data.name_localizations ??= {};
		this.data.name_localizations[locale] = localizedName;

		return this;
	}

	/**
	 * Clears a name localization for this command.
	 *
	 * @param locale - The locale to clear
	 */
	public clearNameLocalization(locale: LocaleString) {
		this.data.name_localizations ??= {};
		this.data.name_localizations[locale] = undefined;

		return this;
	}

	/**
	 * Sets the name localizations for this command.
	 *
	 * @param localizedNames - The object of localized names to set
	 */
	public setNameLocalizations(localizedNames: Partial<Record<LocaleString, string>>) {
		this.data.name_localizations = {};

		for (const args of Object.entries(localizedNames)) {
			this.setNameLocalization(...(args as [LocaleString, string]));
		}

		return this;
	}

	/**
	 * Clears the name localizations for this command.
	 */
	public clearNameLocalizations() {
		this.data.name_localizations = undefined;
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

	/**
	 * {@inheritDoc CommandBuilder.toJSON}
	 */
	public abstract override toJSON(validationOverride?: boolean): RESTPostAPIContextMenuApplicationCommandsJSONBody;
}
