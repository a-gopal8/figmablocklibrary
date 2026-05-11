/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta
 * Base block: hero
 * Source selector: section.section.inverse-section
 * Generated: 2026-05-11
 *
 * Source structure:
 *   section.section.inverse-section > .container > .grid-layout.desktop-1-column
 *     - div (wrapper with position/overflow):
 *       - img.cover-image (background image with overlay utility classes)
 *       - div.overlay (visual overlay layer)
 *       - div.card-body.utility-text-on-overlay:
 *         - h2.h1-heading (main heading)
 *         - p.subheading (description text)
 *         - div.button-group > a.button.inverse-button (CTA link)
 *
 * Target structure (hero block):
 *   Row 1: Background image
 *   Row 2: Heading + Description + CTA links
 */
export default function parse(element, { document }) {
  // Extract background/hero image
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], .grid-layout img');

  // Extract heading (h2 with h1-heading class, fallback to h1/h2/h3)
  const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');

  // Extract description/subheading paragraph
  const description = element.querySelector('p.subheading, p[class*="subheading"], .card-body p, .utility-text-on-overlay p');

  // Extract CTA links from button group
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, a.inverse-button')
  );

  // Build cells array matching hero block library structure
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Text content - heading, description, and CTAs in a single cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
