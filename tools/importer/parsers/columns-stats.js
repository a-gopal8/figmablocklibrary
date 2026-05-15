/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats variant.
 * Base block: columns
 * Source: https://www.apple.com/uk/iphone-17/ (section.section-performance)
 * Generated: 2026-05-11
 *
 * Extracts performance stat tiles from the comparison section and maps them
 * into a columns-stats block. Each stat tile (CPU, GPU, battery) becomes
 * a column in a single row. Uses the first visible comparison option's stats.
 *
 * Source DOM structure:
 *   section.section-performance
 *     > .viewport-content > header.ps-section-header (eyebrow + headline)
 *     > .image-wrapper (hero battery image)
 *     > .aap-positioning-container
 *       > .viewport-content > .inline-compare-intro (body copy + charge stat)
 *       > .viewport-content > .inline-compare-wrap (comparison gallery with stat tiles)
 *
 * Target block table structure (columns):
 *   Row 1: [stat1] | [stat2] | [stat3]
 *   Each stat cell contains a paragraph with the stat value and label text.
 */
export default function parse(element, { document }) {
  // --- Extract stat tiles from the first visible comparison option ---
  // Each .inline-compare-option contains 3 .ps-stat divs (CPU, GPU, battery)
  // The first option with class "show" is the default visible one
  const visibleOption = element.querySelector('.inline-compare-option.show')
    || element.querySelector('.inline-compare-option:first-child');

  const statDivs = visibleOption
    ? Array.from(visibleOption.querySelectorAll(':scope > .ps-stat'))
    : [];

  // Fallback: if no comparison options found, look for all .ps-stat elements
  // within the inline-compare-wrap
  const fallbackStats = statDivs.length > 0
    ? statDivs
    : Array.from(element.querySelectorAll('.inline-compare-wrap .ps-stat'));

  // Build a cell for each stat tile
  // Each stat has: <span class="ps-stat-copy">prefix</span>
  //                <span class="gradient-wrapper">value</span>
  //                <span class="ps-stat-copy">label</span>
  const statCells = fallbackStats.map((statDiv) => {
    // Find the paragraph that holds the stat content
    const statP = statDiv.querySelector('.ps-stat-p, p');
    if (statP) {
      // Create a clean paragraph with the stat text
      const p = document.createElement('p');

      // Extract the spans to build clean text
      const spans = Array.from(statP.querySelectorAll(':scope > span'));
      spans.forEach((span) => {
        // Clean up <br> tags that are used for responsive line breaks
        const brs = span.querySelectorAll('br');
        brs.forEach((br) => {
          br.replaceWith(document.createTextNode(' '));
        });

        // Remove footnote superscripts from the stat text
        const sups = span.querySelectorAll('sup.footnote');
        sups.forEach((sup) => sup.remove());

        if (span.classList.contains('gradient-wrapper')) {
          // The value portion - make it bold
          const strong = document.createElement('strong');
          strong.textContent = span.textContent.trim().replace(/\s+/g, ' ');
          p.appendChild(strong);
          p.appendChild(document.createTextNode(' '));
        } else if (span.classList.contains('ps-stat-copy')) {
          // The prefix/label text
          p.appendChild(document.createTextNode(span.textContent.trim().replace(/\s+/g, ' ') + ' '));
        }
      });

      // Trim trailing whitespace
      if (p.lastChild && p.lastChild.nodeType === 3) {
        p.lastChild.textContent = p.lastChild.textContent.trimEnd();
      }

      return [p];
    }

    // Fallback: use the div's text content directly
    const p = document.createElement('p');
    p.textContent = statDiv.textContent.trim().replace(/\s+/g, ' ');
    return [p];
  });

  // Only proceed if we found stat tiles
  if (statCells.length === 0) {
    return;
  }

  // Build cells array: single row with one cell per stat column
  const cells = [statCells.map((cell) => cell[0])];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-stats',
    cells,
  });

  element.replaceWith(block);
}
