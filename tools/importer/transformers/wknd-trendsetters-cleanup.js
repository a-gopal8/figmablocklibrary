/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters cleanup.
 * Removes non-authorable site chrome (nav, footer, skip links).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content - selectors from cleaned.html:
    // - a.skip-link: <a href="#main-content" class="skip-link">Skip to main content</a>
    // - div.navbar: site navigation with mega menus
    // - footer.footer: site footer with social links and nav columns
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer',
    ]);
  }
}
