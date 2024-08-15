import { ChannelType, type APIApplicationCommandChannelOption } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../../util/normalizeArray';

export const allowedChannelTypes = [
	ChannelType.GuildText,
	ChannelType.GuildVoice,
	ChannelType.GuildCategory,
	ChannelType.GuildAnnouncement,
	ChannelType.AnnouncementThread,
	ChannelType.PublicThread,
	ChannelType.PrivateThread,
	ChannelType.GuildStageVoice,
	ChannelType.GuildForum,
	ChannelType.GuildMedia,
] as const;

/**
 * Allowed channel types used for a channel option.
 */
export type ApplicationCommandOptionAllowedChannelTypes = (typeof allowedChannelTypes)[number];

export interface ApplicationCommandOptionChannelTypesData
	extends Pick<APIApplicationCommandChannelOption, 'channel_types'> {}

/**
 * This mixin holds channel type symbols used for options.
 */
export class ApplicationCommandOptionChannelTypesMixin {
	protected declare readonly data: ApplicationCommandOptionChannelTypesData;

	/**
	 * Adds channel types to this option.
	 *
	 * @param channelTypes - The channel types
	 */
	public addChannelTypes(...channelTypes: RestOrArray<ApplicationCommandOptionAllowedChannelTypes>) {
		this.data.channel_types ??= [];
		this.data.channel_types.push(...normalizeArray(channelTypes));

		return this;
	}
}
