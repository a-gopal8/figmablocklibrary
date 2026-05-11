/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article
 * Base block: cards
 * Source selector: section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column
 * Generated: 2026-05-11
 *
 * Source structure:
 *   .grid-layout.desktop-4-column.grid-gap-md
 *     - a.article-card.card-link (one per card, links to blog post)
 *       - div > img (card image)
 *       - div (card body)
 *         - div (meta): span (tag/category) + span (date)
 *         - h3 (title)
 *
 * Target structure (cards block):
 *   Each row = one card with two cells:
 *     Cell 1: Image
 *     Cell 2: Body content (category tag, date, heading with link)
 *
 * Note: The selector may resolve to the gallery grid (grid-gap-sm) on some pages.
 * Parser identifies the correct article grid by looking for a.article-card children
 * or the grid-gap-md class distinguishing articles from gallery.
 */
export default function parse(element, { document }) {
  // Determine the correct target element - the article cards grid
  // The selector may resolve to the gallery grid instead of the article grid
  let targetElement = element;

  // Check if the current element has article-card children
  const hasArticleCards = element.querySelector('a.article-card, a.card-link');
  if (!hasArticleCards) {
    // Try to find the article cards grid in the parent section or document
    const section = element.closest('section') || element.parentElement;
    const parentContainer = section ? section.parentElement : document;
    // Look for the grid that contains article cards (grid-gap-md)
    const allGrids = parentContainer.querySelectorAll('.grid-layout.desktop-4-column');
    for (let i = 0; i < allGrids.length; i += 1) {
      if (allGrids[i].querySelector('a.article-card, a.card-link')) {
        targetElement = allGrids[i];
        break;
      }
    }
  }

  // Select all article cards within the target element
  const cards = targetElement.querySelectorAll('a.article-card, a.card-link');

  const cells = [];

  cards.forEach((card) => {
    // Extract card image
    const image = card.querySelector('img');

    // Extract category tag (first span in meta area)
    const tag = card.querySelector('.tag, span:first-child');

    // Extract date (second span in meta area, with secondary text class)
    const meta = card.querySelectorAll('span');
    const date = meta.length > 1 ? meta[1] : null;

    // Extract heading/title
    const heading = card.querySelector('h3, h4, [class*="heading"]');

    // Build image cell
    const imageCell = image ? [image] : [];

    // Build body cell
    const bodyCell = [];

    if (tag && tag.textContent.trim()) {
      const tagP = document.createElement('p');
      tagP.append(document.createTextNode(tag.textContent.trim()));
      bodyCell.push(tagP);
    }

    if (date && date.textContent.trim()) {
      const dateP = document.createElement('p');
      dateP.append(document.createTextNode(date.textContent.trim()));
      bodyCell.push(dateP);
    }

    // Create heading with link preserving the card's href
    const href = card.getAttribute('href');
    if (heading && heading.textContent.trim()) {
      const h3 = document.createElement('h3');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.append(document.createTextNode(heading.textContent.trim()));
        h3.append(link);
      } else {
        h3.append(document.createTextNode(heading.textContent.trim()));
      }
      bodyCell.push(h3);
    }

    // Each card is one row with two cells: [image, body]
    if (imageCell.length > 0 || bodyCell.length > 0) {
      cells.push([imageCell, bodyCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
