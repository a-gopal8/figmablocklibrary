/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product variant.
 * Base block: cards
 * Source: https://www.apple.com/uk/iphone-17/
 * Selector: section.section-accessories
 * Generated: 2026-05-11
 *
 * Extracts product accessory cards from the accessories section.
 * Each card has an image and text content (heading + description).
 * Matches the Cards block library table structure: 2 columns per row,
 * image in cell 1, text content in cell 2.
 */
export default function parse(element, { document }) {
  // Extract individual card items from the accessories grid
  // Validated selectors: ul.accessories-grid > li.accessories-item
  const cardItems = element.querySelectorAll('li.accessories-item, .accessories-item');

  const cells = [];

  cardItems.forEach((item) => {
    // Cell 1: Image
    // Validated selector: .image-wrapper picture, .accessories-card img
    const picture = item.querySelector('.image-wrapper picture, .accessories-card picture');
    const img = item.querySelector('.image-wrapper img, .accessories-card img');
    const imageCell = picture || img;

    // Cell 2: Text content (heading + description)
    // Validated selectors: h3.tile-header, p.tile-copy
    const heading = item.querySelector('h3.tile-header, .tile-header, .accessories-copy h3');
    const description = item.querySelector('p.tile-copy, .tile-copy, .accessories-copy p');

    const textContent = [];
    if (heading) textContent.push(heading);
    if (description) textContent.push(description);

    // Only add row if we have at least an image or text content
    if (imageCell || textContent.length > 0) {
      cells.push([imageCell || '', textContent]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
