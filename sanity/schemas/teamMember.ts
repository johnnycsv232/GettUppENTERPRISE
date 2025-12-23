import { defineField, defineType } from "sanity";

export const teamMember = defineType({
	name: "teamMember",
	title: "Team Member",
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
			title: "Role",
			type: "string",
		}),
		defineField({
			name: "photo",
			title: "Photo",
			type: "image",
			options: { hotspot: true },
		}),
		defineField({
			name: "bio",
			title: "Bio",
			type: "text",
			rows: 3,
		}),
		defineField({
			name: "socialLinks",
			title: "Social Links",
			type: "object",
			fields: [
				{ name: "instagram", type: "url", title: "Instagram" },
				{ name: "linkedin", type: "url", title: "LinkedIn" },
				{ name: "twitter", type: "url", title: "Twitter" },
			],
		}),
	],
	preview: {
		select: { title: "name", subtitle: "role", media: "photo" },
	},
});
