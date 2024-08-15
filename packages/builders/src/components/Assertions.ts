import { ButtonStyle, ChannelType, ComponentType, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import { z } from 'zod';
import { customIdPredicate, refineURLPredicate } from '../Assertions.js';

const labelPredicate = z.string().min(1).max(80);

export const emojiPredicate = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		animated: z.boolean().optional(),
	})
	.strict();

const buttonPredicateBase = z.object({
	type: z.literal(ComponentType.Button),
	disabled: z.boolean().optional(),
});

const buttonLinkPredicate = buttonPredicateBase
	.extend({
		style: z.literal(ButtonStyle.Link),
		url: z
			.string()
			.url()
			.refine(refineURLPredicate(['http:', 'https:', 'discord:'])),
		emoji: emojiPredicate.optional(),
		label: labelPredicate,
	})
	.strict();

const buttonCustomIdPredicate = buttonPredicateBase
	.extend({
		style: z.union([
			z.literal(ButtonStyle.Primary),
			z.literal(ButtonStyle.Secondary),
			z.literal(ButtonStyle.Success),
			z.literal(ButtonStyle.Danger),
		]),
		custom_id: customIdPredicate,
		emoji: emojiPredicate.optional(),
		label: labelPredicate,
	})
	.strict();

const buttonPremiumPredicate = buttonPredicateBase
	.extend({
		style: z.literal(ButtonStyle.Premium),
		sku_id: z.string(),
	})
	.strict();

export const buttonPredicate = z.union([buttonLinkPredicate, buttonCustomIdPredicate, buttonPremiumPredicate]);

const selectMenuBasePredicate = z.object({
	placeholder: z.string().max(150).optional(),
	min_values: z.number().min(0).max(25).optional(),
	max_values: z.number().min(0).max(25).optional(),
	custom_id: customIdPredicate,
	disabled: z.boolean().optional(),
});

export const selectMenuChannelPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.ChannelSelect),
	channel_types: z.nativeEnum(ChannelType).array().optional(),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.Channel) })
		.array()
		.optional(),
});

export const selectMenuMentionablePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.MentionableSelect),
	default_values: z
		.object({
			id: z.string(),
			type: z.union([z.literal(SelectMenuDefaultValueType.Role), z.literal(SelectMenuDefaultValueType.User)]),
		})
		.array()
		.optional(),
});

export const selectMenuRolePredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.RoleSelect),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.Role) })
		.array()
		.optional(),
});

export const selectMenuStringOptionPredicate = z.object({
	label: labelPredicate,
	value: z.string().min(1).max(100),
	description: z.string().min(1).max(100).optional(),
	emoji: emojiPredicate.optional(),
	default: z.boolean().optional(),
});

export const selectMenuStringPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.StringSelect),
	options: selectMenuStringOptionPredicate.array().max(25).optional(),
});

export const selectMenuUserPredicate = selectMenuBasePredicate.extend({
	type: z.literal(ComponentType.UserSelect),
	default_values: z
		.object({ id: z.string(), type: z.literal(SelectMenuDefaultValueType.User) })
		.array()
		.optional(),
});

export const actionRowPredicate = z.object({
	type: z.literal(ComponentType.ActionRow),
	components: z.union([
		z
			.object({ type: z.literal(ComponentType.Button) })
			.array()
			.min(1)
			.max(5),
		z
			.object({
				type: z.union([
					z.literal(ComponentType.ChannelSelect),
					z.literal(ComponentType.MentionableSelect),
					z.literal(ComponentType.RoleSelect),
					z.literal(ComponentType.StringSelect),
					z.literal(ComponentType.UserSelect),
					// And this!
					z.literal(ComponentType.TextInput),
				]),
			})
			.array()
			.length(1),
	]),
});
