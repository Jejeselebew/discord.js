import { z } from 'zod';
import { refineURLPredicate } from '../../Assertions.js';

export const namePredicate = z.string().min(1).max(256);

export const iconURLPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:', 'attachment:']), {
		message: 'Invalid protocol for icon URL. Must be http:, https:, or attachment:',
	});

export const URLPredicate = z
	.string()
	.url()
	.refine(refineURLPredicate(['http:', 'https:']), { message: 'Invalid protocol for URL. Must be http: or https:' });

export const embedFieldPredicate = z.object({
	name: namePredicate,
	value: z.string().min(1).max(1_024),
	inline: z.boolean().optional(),
});

export const embedAuthorPredicate = z.object({
	name: namePredicate,
	icon_url: iconURLPredicate.optional(),
	url: URLPredicate.optional(),
});

export const embedFooterPredicate = z.object({
	text: z.string().min(1).max(2_048),
	icon_url: iconURLPredicate.optional(),
});

export const embedPredicate = z
	.object({
		title: namePredicate.optional(),
		description: z.string().min(1).max(4_096).optional(),
		url: URLPredicate.optional(),
		timestamp: z.string().optional(),
		color: z.number().int().min(0).max(0xffffff).optional(),
		footer: embedFooterPredicate.optional(),
		image: z.object({ url: URLPredicate }).optional(),
		thumbnail: z.object({ url: URLPredicate }).optional(),
		author: embedAuthorPredicate.optional(),
		fields: z.array(embedFieldPredicate).max(25).optional(),
	})
	.refine(
		(value) => {
			return Object.keys(value).length > 0;
		},
		{ message: 'Embed must have at least one property set' },
	);
