/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-featured
 * Base block: columns
 * Source: https://wknd-trendsetters.site/
 * Selector: section.section:nth-of-type(1) > .container > .grid-layout
 * Generated: 2026-05-11
 *
 * Extracts a two-column featured article layout:
 *   Column 1: Cover image
 *   Column 2: Breadcrumbs, heading, author byline, date/read time
 */
export default function parse(element, { document }) {
  // The grid-layout contains two direct child divs representing the two columns
  const columns = element.querySelectorAll(':scope > div');

  // Column 1: Image
  const imageCol = columns[0];
  const image = imageCol ? imageCol.querySelector('img.cover-image, img[class*="cover"], img') : null;

  // Column 2: Text content (breadcrumbs, heading, author info)
  const textCol = columns[1];

  // Build left cell content (image)
  const leftCell = [];
  if (image) {
    leftCell.push(image);
  }

  // Build right cell content (all text content from the second column)
  const rightCell = [];

  if (textCol) {
    // Breadcrumbs
    const breadcrumbs = textCol.querySelector('.breadcrumbs');
    if (breadcrumbs) {
      rightCell.push(breadcrumbs);
    }

    // Heading
    const heading = textCol.querySelector('h2, h1, h3, [class*="heading"]');
    if (heading) {
      rightCell.push(heading);
    }

    // Author and date info - contained in nested divs after the heading
    const metaDivs = textCol.querySelectorAll(':scope > div:not(.breadcrumbs)');
    metaDivs.forEach((metaDiv) => {
      // Include author byline and date/read-time info divs
      if (metaDiv.querySelector('.flex-horizontal, [class*="flex"]')) {
        rightCell.push(metaDiv);
      }
    });
  }

  // Build cells array: one row with two columns
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
