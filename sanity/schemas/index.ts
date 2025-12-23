/**
 * Sanity Schema Types
 * Export all schema types for the studio
 */

import { faqItem } from "./faqItem";
import { galleryItem } from "./galleryItem";
import { pricingTier } from "./pricingTier";
import { siteSettings } from "./siteSettings";
import { teamMember } from "./teamMember";
import { testimonial } from "./testimonial";
import { venue } from "./venue";

export const schemaTypes = [
	galleryItem,
	testimonial,
	venue,
	siteSettings,
	pricingTier,
	faqItem,
	teamMember,
];
