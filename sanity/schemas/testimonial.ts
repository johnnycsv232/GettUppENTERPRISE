import { defineField, defineType } from "sanity";

export const testimonial = defineType({
	name: "testimonial",
	title: "Testimonial",
	type: "document",
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "role",
			title: "Role/Title",
			type: "string",
		}),
		defineField({
			name: "venue",
			title: "Venue",
			type: "reference",
			to: [{ type: "venue" }],
		}),
		defineField({
			name: "quote",
			title: "Quote",
			type: "text",
			rows: 4,
			validation: (Rule) => Rule.required().min(20).max(500),
		}),
		defineField({
			name: "avatar",
			title: "Avatar",
			type: "image",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "rating",
			title: "Rating",
			type: "number",
			validation: (Rule) => Rule.min(1).max(5),
			initialValue: 5,
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: "name",
			subtitle: "venue.name",
			media: "avatar",
		},
	},
});
