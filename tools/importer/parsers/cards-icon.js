/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base block: cards
 * Source: https://www.apple.com/uk/iphone-17/
 * Selectors: section.section-incentive, section.section-environment, section.section-values
 * Generated: 2026-05-11
 *
 * Handles three card patterns within these sections:
 *
 * 1. Incentive cards (li.feature-card):
 *    - .feature-card-content > .feature-card-copy-container > h3.feature-card-label
 *    - .feature-card-copy-stack > p.feature-card-headline + p.feature-card-body
 *    - figure.feature-card-image-container > picture > img
 *    - a.card-control (link)
 *
 * 2. Environment cards (li.icon-card):
 *    - .icon-card-content > .icon-card-icon-wrapper > picture > img
 *    - .icon-card-copy-wrapper > h3.icon-card-headline
 *    - .icon-card-body-copy-wrapper > p.icon-card-body-copy (may be empty)
 *    - button.card-control (modal, no link)
 *
 * 3. Values cards (li.icon-card):
 *    - .icon-card-content > .icon-card-icon-wrapper > picture > img
 *    - .icon-card-copy-wrapper > h3.icon-card-headline
 *    - .icon-card-body-copy-wrapper > p.icon-card-body-copy (description)
 *    - a.action-handler (text link) + a.card-control (href link)
 *
 * Target structure (from Cards block library):
 *   2 columns per row: Column 1 = Image/Icon | Column 2 = Heading + Description + optional CTA
 */
export default function parse(element, { document }) {
  // Find all card items - handles both feature-card and icon-card patterns
  const cards = element.querySelectorAll('li.card-container');

  const cells = [];

  cards.forEach((card) => {
    const imageCell = [];
    const contentCell = [];

    // Determine card type based on internal structure
    const isFeatureCard = !!card.querySelector('.feature-card-content');
    const isIconCard = !!card.querySelector('.icon-card-content');

    if (isFeatureCard) {
      // === INCENTIVE CARD PATTERN ===

      // Image from figure.feature-card-image-container
      const img = card.querySelector('figure.feature-card-image-container img, .feature-card-image-container img');
      if (img && !img.src.startsWith('data:')) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        if (img.alt) imgEl.alt = img.alt;
        imageCell.push(imgEl);
      }

      // Heading from h3.feature-card-label
      const label = card.querySelector('h3.feature-card-label, .feature-card-label');
      if (label) {
        const heading = document.createElement('h3');
        heading.textContent = label.textContent.trim();
        contentCell.push(heading);
      }

      // Headline text
      const headline = card.querySelector('p.feature-card-headline, .feature-card-headline');
      if (headline) {
        const p = document.createElement('p');
        p.textContent = headline.textContent.trim();
        contentCell.push(p);
      }

      // Body text
      const body = card.querySelector('p.feature-card-body, .feature-card-body');
      if (body && body.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = body.textContent.trim();
        contentCell.push(p);
      }

      // CTA link from a.card-control
      const link = card.querySelector('a.card-control');
      if (link && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = label ? label.textContent.trim() : 'Learn more';
        const linkP = document.createElement('p');
        linkP.appendChild(a);
        contentCell.push(linkP);
      }
    } else if (isIconCard) {
      // === ICON CARD PATTERN (Environment + Values) ===

      // Icon image from .icon-card-icon-wrapper
      const img = card.querySelector('.icon-card-icon-wrapper img, .icon-card-icon img');
      if (img && !img.src.startsWith('data:')) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src;
        if (img.alt) imgEl.alt = img.alt;
        imageCell.push(imgEl);
      }

      // Heading from h3.icon-card-headline
      const headline = card.querySelector('h3.icon-card-headline, .icon-card-headline');
      if (headline) {
        const heading = document.createElement('h3');
        heading.textContent = headline.textContent.trim();
        contentCell.push(heading);
      }

      // Body copy from p.icon-card-body-copy
      const bodyCopy = card.querySelector('p.icon-card-body-copy, .icon-card-body-copy');
      if (bodyCopy && bodyCopy.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = bodyCopy.textContent.trim();
        contentCell.push(p);
      }

      // CTA link - check for a.action-handler first (values section), then a.card-control
      const actionLink = card.querySelector('a.action-handler');
      const cardControlLink = card.querySelector('a.card-control');
      if (actionLink && actionLink.href) {
        const a = document.createElement('a');
        a.href = actionLink.href;
        // Use the icon-copy span text or fallback
        const iconCopy = actionLink.querySelector('.icon-copy');
        a.textContent = iconCopy ? iconCopy.textContent.trim() : 'Learn more';
        const linkP = document.createElement('p');
        linkP.appendChild(a);
        contentCell.push(linkP);
      } else if (cardControlLink && cardControlLink.href) {
        const a = document.createElement('a');
        a.href = cardControlLink.href;
        const headline = card.querySelector('h3');
        a.textContent = headline ? headline.textContent.trim() : 'Learn more';
        const linkP = document.createElement('p');
        linkP.appendChild(a);
        contentCell.push(linkP);
      }
    }

    // Only add the row if we have meaningful content
    if (contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
