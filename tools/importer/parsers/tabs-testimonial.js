/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/
 * Selector: .tabs-wrapper
 * Generated: 2026-05-11
 *
 * Structure: Each tab row = [tab-label, panel-content]
 * - Tab label: person's name (becomes the tab button text)
 * - Panel content: image, name, role, and testimonial quote
 */
export default function parse(element, { document }) {
  // Extract tab panes - these contain the panel content
  const tabPanes = element.querySelectorAll('.tab-pane');
  // Extract tab menu buttons for the label names
  const tabButtons = element.querySelectorAll('.tab-menu-link, .tab-menu button');

  const cells = [];

  tabPanes.forEach((pane, index) => {
    // Get tab label from button name or panel name
    let labelText = 'Tab ' + (index + 1);
    if (tabButtons[index]) {
      const strong = tabButtons[index].querySelector('strong');
      if (strong) labelText = strong.textContent.trim();
    } else {
      const strong = pane.querySelector('strong');
      if (strong) labelText = strong.textContent.trim();
    }

    // Build panel content array referencing source elements
    const panelContent = [];

    // Main image from the panel
    const img = pane.querySelector('img');
    if (img) panelContent.push(img);

    // Name (bold)
    const nameStrong = pane.querySelector('.paragraph-xl strong, strong');
    if (nameStrong) {
      const p = document.createElement('p');
      const s = document.createElement('strong');
      s.textContent = nameStrong.textContent.trim();
      p.appendChild(s);
      panelContent.push(p);
    }

    // Role - the div sibling after the name container
    const nameDiv = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameDiv && nameDiv.nextElementSibling && !nameDiv.nextElementSibling.classList.contains('paragraph-xl')) {
      const roleP = document.createElement('p');
      roleP.textContent = nameDiv.nextElementSibling.textContent.trim();
      panelContent.push(roleP);
    }

    // Testimonial quote
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) {
      const quoteP = document.createElement('p');
      quoteP.textContent = quote.textContent.trim();
      panelContent.push(quoteP);
    }

    // Row: [label, content]
    cells.push([labelText, panelContent]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
