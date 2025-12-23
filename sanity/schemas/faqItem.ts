import { defineField, defineType } from "sanity";

export const faqItem = defineType({
	name: "faqItem",
	title: "FAQ Item",
	type: "document",
	fields: [
		defineField({
			name: "question",
			title: "Question",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "answer",
			title: "Answer",
			type: "text",
			rows: 4,
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "string",
			options: {
				list: [
					{ title: "General", value: "general" },
					{ title: "Pricing", value: "pricing" },
					{ title: "Content", value: "content" },
					{ title: "Process", value: "process" },
				],
			},
			initialValue: "general",
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
		select: { title: "question", subtitle: "category" },
	},
});
