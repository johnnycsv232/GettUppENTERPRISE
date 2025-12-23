import { defineField, defineType } from "sanity";

export const venue = defineType({
	name: "venue",
	title: "Venue",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Venue Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "address",
			title: "Address",
			type: "string",
		}),
		defineField({
			name: "neighborhood",
			title: "Neighborhood",
			type: "string",
			options: {
				list: [
					{ title: "Downtown", value: "downtown" },
					{ title: "North Loop", value: "north-loop" },
					{ title: "Uptown", value: "uptown" },
					{ title: "Northeast", value: "northeast" },
					{ title: "St. Paul", value: "st-paul" },
				],
			},
		}),
		defineField({
			name: "venueType",
			title: "Venue Type",
			type: "string",
			options: {
				list: [
					{ title: "Nightclub", value: "nightclub" },
					{ title: "Bar", value: "bar" },
					{ title: "Lounge", value: "lounge" },
					{ title: "Restaurant", value: "restaurant" },
					{ title: "Event Space", value: "event-space" },
				],
			},
		}),
		defineField({
			name: "subscriptionTier",
			title: "Subscription Tier",
			type: "reference",
			to: [{ type: "pricingTier" }],
		}),
		defineField({
			name: "isActive",
			title: "Active Client",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "socialLinks",
			title: "Social Links",
			type: "object",
			fields: [
				{ name: "instagram", type: "url", title: "Instagram" },
				{ name: "facebook", type: "url", title: "Facebook" },
				{ name: "website", type: "url", title: "Website" },
			],
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "neighborhood",
			media: "logo",
		},
	},
});
