/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-editorial
 * Base block: hero
 * Source selector: header.section.secondary-section
 * Generated: 2026-05-11
 *
 * Source structure:
 *   header.section.secondary-section > .container > .grid-layout
 *     - div (text content): h1.h1-heading, p.subheading, .button-group with CTAs
 *     - div (images): multiple img.cover-image elements
 *
 * Target structure (hero block library):
 *   Row 1: Block name
 *   Row 2: Background/hero image(s)
 *   Row 3: Title (heading) + Subheading (text) + Call-to-Action (links)
 */
export default function parse(element, { document }) {
  // Extract heading (h1, h2, or element with heading class)
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');

  // Extract subheading/description paragraph
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], .grid-layout > div > p');

  // Extract CTA links from button group
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a, a.button, a.secondary-button')
  );

  // Extract hero images
  const images = Array.from(
    element.querySelectorAll('img.cover-image, .grid-layout img')
  );

  // Build cells array matching hero block library structure
  const cells = [];

  // Row 2: Images (background/hero imagery)
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3: Text content - heading, subheading, and CTAs in a single cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-editorial', cells });
  element.replaceWith(block);
}
