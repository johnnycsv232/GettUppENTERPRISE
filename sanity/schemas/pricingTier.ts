import { defineField, defineType } from "sanity";

export const pricingTier = defineType({
	name: "pricingTier",
	title: "Pricing Tier",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Tier Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: { source: "name", maxLength: 50 },
		}),
		defineField({
			name: "price",
			title: "Monthly Price",
			type: "number",
			validation: (Rule) => Rule.required().min(0),
		}),
		defineField({
			name: "stripePriceId",
			title: "Stripe Price ID",
			type: "string",
			description: "The Stripe price ID for this tier",
		}),
		defineField({
			name: "features",
			title: "Features",
			type: "array",
			of: [{ type: "string" }],
		}),
		defineField({
			name: "highlight",
			title: "Highlight Feature",
			type: "string",
		}),
		defineField({
			name: "recommended",
			title: "Recommended",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "order",
			title: "Display Order",
			type: "number",
			initialValue: 0,
		}),
	],
	orderings: [
		{
			title: "Order",
			name: "orderAsc",
			by: [{ field: "order", direction: "asc" }],
		},
	],
	preview: {
		select: { title: "name", subtitle: "price" },
		prepare({ title, subtitle }) {
			return { title, subtitle: `$${subtitle}/mo` };
		},
	},
});
