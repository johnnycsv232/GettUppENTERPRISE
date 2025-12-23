import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Site Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "tagline",
			title: "Tagline",
			type: "string",
		}),
		defineField({
			name: "description",
			title: "Site Description",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "logo",
			title: "Logo",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "socialLinks",
			title: "Social Links",
			type: "object",
			fields: [
				{ name: "instagram", type: "url", title: "Instagram" },
				{ name: "tiktok", type: "url", title: "TikTok" },
				{ name: "facebook", type: "url", title: "Facebook" },
				{ name: "youtube", type: "url", title: "YouTube" },
			],
		}),
		defineField({
			name: "contactEmail",
			title: "Contact Email",
			type: "string",
		}),
		defineField({
			name: "contactPhone",
			title: "Contact Phone",
			type: "string",
		}),
	],
	preview: {
		select: { title: "title" },
	},
});
