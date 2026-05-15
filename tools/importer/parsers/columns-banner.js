/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-banner
 * Base block: columns
 * Description: Promotional banner with text content in one column and an image
 *   in the other. Extracts heading, CTA link, and banner image from the source
 *   banner-card structure and maps them into a two-column Columns block.
 * Source selector: section.section-upgrade-banner
 * Generated: 2026-05-11
 */
export default function parse(element, { document }) {
  // --- Extract text column content ---

  // Heading: banner card headline inside the copy column
  // Source: h2.banner-card-header > span.banner-card-headline
  const headline = element.querySelector('.banner-card-headline, .banner-card-header, h2[class*="banner"]');

  // CTA link: primary call-to-action inside the banner card
  // Source: div.banner-card-ctas a.banner-card-cta
  const ctaLink = element.querySelector('.banner-card-cta, .banner-card-ctas a, a.button');

  // Build the text column content array
  const textContent = [];

  if (headline) {
    // Create a clean heading element with the headline text
    const h2 = document.createElement('h2');
    h2.textContent = headline.textContent.replace(/\s+/g, ' ').trim();
    textContent.push(h2);
  }

  if (ctaLink) {
    // Clone the CTA link to preserve href and text
    const link = document.createElement('a');
    link.href = ctaLink.href;
    link.textContent = ctaLink.textContent.trim();
    const p = document.createElement('p');
    p.append(link);
    textContent.push(p);
  }

  // --- Extract image column content ---

  // Image: banner card image inside the asset column
  // Source: div.banner-card-asset-column picture.banner-card-image img
  const picture = element.querySelector('.banner-card-asset-column picture, .banner-card-image, picture');
  const img = picture
    ? picture.querySelector('img')
    : element.querySelector('.banner-card-asset-column img, img[class*="banner"]');

  const imageContent = [];
  if (img) {
    // Create a clean image element preserving src and alt
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt || '';
    imageContent.push(newImg);
  }

  // --- Build cells array ---
  // Columns block: one row with two columns
  // Column 1 (text): heading + CTA link
  // Column 2 (image): banner image
  const cells = [
    [textContent, imageContent],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
