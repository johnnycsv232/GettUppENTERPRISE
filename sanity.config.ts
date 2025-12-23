/**
 * Sanity Studio Configuration
 * @see https://www.sanity.io/docs/configuration
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nczdqvbz";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
	name: "gettupp-studio",
	title: "GettUpp ENT Studio",

	projectId,
	dataset,

	plugins: [structureTool(), visionTool({ defaultApiVersion: "2024-01-01" })],

	schema: {
		types: schemaTypes,
	},

	// Studio theme
	studio: {
		components: {
			// Custom branding can go here
		},
	},
});
