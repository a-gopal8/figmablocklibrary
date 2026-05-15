/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product
 * Base block: hero
 * Source: https://www.apple.com/uk/iphone-17/
 * Selector: section.section-welcome
 * Generated: 2026-05-11
 *
 * Source structure:
 *   - .marquee-top > .marquee-header > h1.header-eyebrow (eyebrow text)
 *   - .marquee-top > .marquee-header > p.header-headline (headline text)
 *   - .inline-media-component-container picture img (hero image)
 *   - .marquee-bottom .marquee-pricing p.pricing-product (pricing text)
 *   - .marquee-bottom a.marquee-ctas-link (CTA link)
 *
 * Target table (hero block library):
 *   Row 1: block name (hero-product)
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading (text) + CTA (link)
 */
export default function parse(element, { document }) {
  // --- Extract from source DOM (validated selectors) ---

  // Eyebrow: h1.header-eyebrow inside .marquee-header
  const eyebrow = element.querySelector('h1.header-eyebrow, .header-eyebrow');

  // Headline: p.header-headline inside .marquee-header
  const headline = element.querySelector('p.header-headline, .header-headline');

  // Hero image: pick the first picture with a meaningful alt text from the media container
  // Fallback to any picture/img inside .inline-media-component-container or .welcome-video
  const heroImage = element.querySelector(
    '.inline-media-component-container picture.fallback-frame img, '
    + '.inline-media-component-container picture img[alt]:not([alt=""]), '
    + '.inline-media-component-container picture img'
  );

  // Pricing: paragraph with pricing info inside .marquee-pricing
  const pricing = element.querySelector(
    'p.pricing-product, '
    + '.marquee-pricing p, '
    + 'p.ric-dynamic-pricing'
  );

  // CTA link: the buy/action link — exclude footnote links inside pricing
  const ctaLink = element.querySelector(
    'a.marquee-ctas-link, '
    + '.marquee-detail a.button, '
    + '.detail-inner-group > a, '
    + '.marquee-bottom a[href]:not(.footnote a):not([href^="#footnote"])'
  );

  // --- Build cells to match hero block library structure ---
  // Each entry in cells is a row; each row is an array of cell contents.
  // To put multiple elements in one cell, wrap them in a container div.
  const cells = [];

  // Row 1: Background image
  if (heroImage) {
    const pictureEl = heroImage.closest('picture');
    cells.push([pictureEl || heroImage]);
  }

  // Row 2: Content cell - eyebrow, headline, pricing, CTA all in a single cell
  const contentContainer = document.createElement('div');

  // Eyebrow as h2 (demoted from h1 for block heading hierarchy)
  if (eyebrow) {
    const eyebrowEl = document.createElement('h2');
    eyebrowEl.textContent = eyebrow.textContent.trim();
    contentContainer.appendChild(eyebrowEl);
  }

  // Headline as h1 (the primary heading for the hero)
  if (headline) {
    const headlineEl = document.createElement('h1');
    headlineEl.textContent = headline.textContent.trim();
    contentContainer.appendChild(headlineEl);
  }

  // Pricing as paragraph text (strip footnote markup, keep just text)
  if (pricing) {
    const pricingEl = document.createElement('p');
    pricingEl.textContent = pricing.textContent.trim();
    contentContainer.appendChild(pricingEl);
  }

  // CTA link - use specific selector to avoid footnote links
  if (ctaLink && ctaLink.textContent.trim()) {
    const link = document.createElement('a');
    link.href = ctaLink.href || ctaLink.getAttribute('href');
    link.textContent = ctaLink.textContent.trim();
    const strong = document.createElement('strong');
    strong.appendChild(link);
    const p = document.createElement('p');
    p.appendChild(strong);
    contentContainer.appendChild(p);
  }

  if (contentContainer.childNodes.length > 0) {
    cells.push([contentContainer]);
  }

  // --- Create block and replace ---
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-product',
    cells,
  });

  element.replaceWith(block);
}
