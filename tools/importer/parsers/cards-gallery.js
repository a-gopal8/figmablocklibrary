/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery variant.
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-05-11
 *
 * Gallery-style cards block containing image-only cards in a grid layout.
 * Each card is a single image with 1:1 aspect ratio (no text body).
 * Source structure: div.grid-layout.desktop-4-column > div.utility-aspect-1x1 > img.cover-image
 */
export default function parse(element, { document }) {
  // The element is the grid container: div.grid-layout.desktop-4-column
  // Inside are direct child divs (utility-aspect-1x1) each containing an img.cover-image
  const cardDivs = element.querySelectorAll(':scope > div');

  const cells = [];

  cardDivs.forEach((cardDiv) => {
    const img = cardDiv.querySelector('img');
    if (img) {
      // Each row in the cards block represents one card
      // For gallery variant: image-only cards (single cell per row)
      cells.push([img]);
    }
  });

  // Fallback: if no direct child divs with images found, try all images
  if (cells.length === 0) {
    const allImages = element.querySelectorAll('img');
    allImages.forEach((img) => {
      cells.push([img]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
