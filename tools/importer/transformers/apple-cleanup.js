/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Apple UK cleanup.
 * Removes non-authorable global chrome, duplicate sections, modals, and nav/footer elements.
 * All selectors verified against captured DOM of https://www.apple.com/uk/iphone-17/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove locale switcher overlay (aside#ac-localeswitcher)
    // Remove modal overlays (div.ric-modal - 4 instances for material, environment, etc.)
    WebImporter.DOMUtils.remove(element, [
      '#ac-localeswitcher',
      '.ric-modal',
    ]);
  }

  if (hookName === H.after) {
    // Remove Apple global header (div#globalheader containing globalnav, globalmessage-segment)
    // Remove local product navigation bar (nav#localnav with product links and buy CTA)
    // Remove Apple global footer (footer#ac-globalfooter)
    // Remove footer legal disclaimers section (section.ac-gf-sosumi)
    // Remove footer breadcrumbs (nav.ac-gf-breadcrumbs)
    // Remove footer directory links (nav.ac-gf-directory)
    // Remove duplicate incentive section (section.section-incentive-alt)
    // Remove any remaining nav, footer, link, noscript elements
    WebImporter.DOMUtils.remove(element, [
      '#globalheader',
      '#localnav',
      '#ac-globalfooter',
      '.ac-gf-sosumi',
      '.ac-gf-breadcrumbs',
      '.ac-gf-directory',
      'section.section-incentive-alt',
      'nav',
      'footer',
      'link',
      'noscript',
    ]);
  }
}
