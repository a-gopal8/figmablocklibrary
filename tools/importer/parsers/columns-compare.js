/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-compare variant.
 * Base block: columns
 * Source: https://www.apple.com/uk/iphone-17/
 * Selectors: section.section-upgrade, section.section-contrast
 * Generated: 2026-05-11
 *
 * Handles two distinct section patterns:
 *
 * 1. Upgrade section (section.section-upgrade): Feature comparison tiles
 *    showing iPhone 17 specs vs older models. Has .compare-tile items with
 *    .tile-copy or .ps-stat text. Only the first/visible comparison option
 *    (.inline-compare-option.show) is extracted.
 *
 * 2. Contrast section (section.section-contrast): Product lineup showing
 *    multiple iPhone models side by side. Has .product-tile items with
 *    image, name, tagline, price, and CTA links.
 */
export default function parse(element, { document }) {
  // Detect which section variant we're handling
  const isUpgradeSection = !!element.querySelector('.compare-tile, .compare-gallery');
  const isContrastSection = !!element.querySelector('.product-tile, .product-tile-contrast-container');

  const container = document.createElement('div');

  if (isUpgradeSection) {
    parseUpgradeSection(element, document, container);
  } else if (isContrastSection) {
    parseContrastSection(element, document, container);
  } else {
    // Fallback: try upgrade first, then contrast patterns
    parseUpgradeSection(element, document, container);
  }

  element.replaceWith(container);
}

/**
 * Parse the upgrade comparison section (section.section-upgrade).
 * Extracts heading, eyebrow, and comparison tiles into a columns block.
 * Only the visible/default comparison option is extracted.
 */
function parseUpgradeSection(element, document, container) {
  // Extract heading
  const heading = element.querySelector('h2.copy-headline, h2');
  if (heading) {
    container.append(heading);
  }

  // Extract eyebrow
  const eyebrow = element.querySelector('p.copy-eyebrow');
  if (eyebrow) {
    container.append(eyebrow);
  }

  // Get only the first/visible comparison option to avoid duplicating tiles
  // across all comparison model variants (iPhone 13, 14, 15, etc.)
  const visibleOption = element.querySelector('.inline-compare-option.show');
  const tileContainer = visibleOption || element;

  // Extract all compare tiles from the visible option
  const tiles = Array.from(tileContainer.querySelectorAll('.compare-tile'));

  // Build cells: each tile becomes a cell with its text content
  // Tiles use either .tile-copy (camera, display, etc.) or .ps-stat (battery, gpu)
  const tileCells = tiles.map((tile) => {
    const cellContent = [];

    // Extract the text - try .tile-copy first, then .ps-stat
    const tileCopy = tile.querySelector('p.tile-copy, p.ps-stat');
    if (tileCopy) {
      cellContent.push(tileCopy);
    }

    return cellContent;
  }).filter((cell) => cell.length > 0);

  // Arrange tiles into rows of 2 columns (matching the visual 2-column grid)
  const cells = [];
  for (let i = 0; i < tileCells.length; i += 2) {
    const row = [tileCells[i]];
    if (i + 1 < tileCells.length) {
      row.push(tileCells[i + 1]);
    }
    cells.push(row);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-compare', cells });
    container.append(block);
  }
}

/**
 * Parse the contrast/product lineup section (section.section-contrast).
 * Extracts heading and product tiles into a columns block where each
 * product is a column with image, name, tagline, price, and CTAs.
 */
function parseContrastSection(element, document, container) {
  // Extract section heading
  const heading = element.querySelector('h2');
  if (heading) {
    container.append(heading);
  }

  // Extract "Explore all iPhone" link if present
  const headerCta = element.querySelector('.section-header-cta-link, .section-header a');
  if (headerCta) {
    const ctaParagraph = document.createElement('p');
    ctaParagraph.append(headerCta);
    container.append(ctaParagraph);
  }

  // Get all product tiles
  const productTiles = Array.from(element.querySelectorAll('.product-tile'));

  if (productTiles.length === 0) {
    return;
  }

  // Build one row with each product as a column
  // Each column cell contains: image, name, tagline, price, CTA links
  const row = productTiles.map((tile) => {
    const cellContent = [];

    // Product image
    const productImg = tile.querySelector('.product-tile-image img');
    if (productImg) {
      cellContent.push(productImg);
    }

    // Product name (headline)
    const headline = tile.querySelector('.product-tile-headline');
    if (headline) {
      const h3 = document.createElement('h3');
      h3.textContent = headline.textContent.trim();
      cellContent.push(h3);
    }

    // Positioning tagline
    const positioning = tile.querySelector('.product-tile-positioning');
    if (positioning) {
      cellContent.push(positioning);
    }

    // Price
    const priceEl = tile.querySelector('.product-tile-price [data-pricing-product]');
    if (priceEl) {
      const priceParagraph = document.createElement('p');
      priceParagraph.textContent = priceEl.textContent.trim();
      cellContent.push(priceParagraph);
    }

    // CTA links (Learn more, Buy)
    const ctaLinks = Array.from(tile.querySelectorAll('.product-tile-ctas a'));
    ctaLinks.forEach((link) => {
      cellContent.push(link);
    });

    return cellContent;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-compare', cells });
  container.append(block);
}
