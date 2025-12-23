import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
	name: "galleryItem",
	title: "Gallery Item",
	type: "document",
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "venue",
			title: "Venue",
			type: "reference",
			to: [{ type: "venue" }],
		}),
		defineField({
			name: "media",
			title: "Media",
			type: "image",
			options: {
				hotspot: true,
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "mediaType",
			title: "Media Type",
			type: "string",
			options: {
				list: [
					{ title: "Photo", value: "photo" },
					{ title: "Reel", value: "reel" },
					{ title: "Video", value: "video" },
				],
			},
			initialValue: "photo",
		}),
		defineField({
			name: "eventDate",
			title: "Event Date",
			type: "date",
		}),
		defineField({
			name: "tags",
			title: "Tags",
			type: "array",
			of: [{ type: "string" }],
			options: {
				layout: "tags",
			},
		}),
		defineField({
			name: "featured",
			title: "Featured",
			type: "boolean",
			initialValue: false,
		}),
		defineField({
			name: "stats",
			title: "Stats",
			type: "object",
			fields: [
				{ name: "views", type: "number", title: "Views" },
				{ name: "likes", type: "number", title: "Likes" },
				{ name: "shares", type: "number", title: "Shares" },
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			media: "media",
			venue: "venue.name",
		},
		prepare({ title, media, venue }) {
			return {
				title,
				subtitle: venue,
				media,
			};
		},
	},
});
