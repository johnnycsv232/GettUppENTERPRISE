/**
 * Sanity Client Configuration
 * @see https://www.sanity.io/docs/js-client
 */

import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

// Sanity image source type
type SanityImageSource = Parameters<
	ReturnType<typeof imageUrlBuilder>["image"]
>[0];

// Project configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nczdqvbz";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

// Create the Sanity client
export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: process.env.NODE_ENV === "production",
	// Token for authenticated requests (server-side only)
	token: process.env.SANITY_API_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}

// Fetch functions
export async function getGalleryItems(limit = 12) {
	return sanityClient.fetch(
		`*[_type == "galleryItem"] | order(eventDate desc) [0...$limit] {
      _id,
      title,
      "imageUrl": media.asset->url,
      mediaType,
      eventDate,
      tags,
      featured,
      stats,
      "venue": venue->name
    }`,
		{ limit },
	);
}

export async function getTestimonials(featured = false) {
	const filter = featured ? " && featured == true" : "";
	return sanityClient.fetch(
		`*[_type == "testimonial"${filter}] | order(_createdAt desc) {
      _id,
      name,
      role,
      quote,
      "avatar": avatar.asset->url,
      rating,
      "venue": venue->name
    }`,
	);
}

export async function getVenues(activeOnly = true) {
	const filter = activeOnly ? " && isActive == true" : "";
	return sanityClient.fetch(
		`*[_type == "venue"${filter}] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      "logo": logo.asset->url,
      description,
      neighborhood,
      venueType,
      socialLinks
    }`,
	);
}

export async function getPricingTiers() {
	return sanityClient.fetch(
		`*[_type == "pricingTier"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      price,
      stripePriceId,
      features,
      highlight,
      recommended
    }`,
	);
}

export async function getFAQItems(category?: string) {
	const filter = category ? ` && category == "${category}"` : "";
	return sanityClient.fetch(
		`*[_type == "faqItem"${filter}] | order(order asc) {
      _id,
      question,
      answer,
      category
    }`,
	);
}

export async function getSiteSettings() {
	return sanityClient.fetch(
		`*[_type == "siteSettings"][0] {
      title,
      tagline,
      description,
      "logo": logo.asset->url,
      socialLinks,
      contactEmail,
      contactPhone
    }`,
	);
}
