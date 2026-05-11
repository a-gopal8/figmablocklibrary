/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Selectors validated against migration-work/cleaned.html.
 *
 * Template sections (from page-templates.json):
 *   1. Hero: header.section.secondary-section (no style)
 *   2. Featured Article: first section.section without secondary-section or inverse-section
 *   3. Gallery: first section.section.secondary-section (style: "grey")
 *   4. Testimonials: second section.section without secondary-section or inverse-section
 *   5. Latest Articles: second section.section.secondary-section (style: "grey")
 *   6. FAQ: third section.section without secondary-section or inverse-section
 *   7. CTA Banner: section.section.inverse-section (no style)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Collect all section-level elements in DOM order
    // From cleaned.html: header.section.secondary-section, then section.section variants
    const allSections = [];

    // Section 1: Hero - header.section.secondary-section
    const hero = element.querySelector('header.section.secondary-section');
    if (hero) allSections.push({ el: hero, section: sections[0] });

    // All section.section elements in DOM order
    const sectionEls = element.querySelectorAll('section.section');
    const secondarySections = [];
    const plainSections = [];
    const inverseSections = [];

    sectionEls.forEach((sec) => {
      if (sec.classList.contains('inverse-section')) {
        inverseSections.push(sec);
      } else if (sec.classList.contains('secondary-section')) {
        secondarySections.push(sec);
      } else {
        plainSections.push(sec);
      }
    });

    // Section 2: Featured Article - first plain section
    if (plainSections[0]) allSections.push({ el: plainSections[0], section: sections[1] });
    // Section 3: Gallery - first secondary-section (style: "grey")
    if (secondarySections[0]) allSections.push({ el: secondarySections[0], section: sections[2] });
    // Section 4: Testimonials - second plain section
    if (plainSections[1]) allSections.push({ el: plainSections[1], section: sections[3] });
    // Section 5: Latest Articles - second secondary-section (style: "grey")
    if (secondarySections[1]) allSections.push({ el: secondarySections[1], section: sections[4] });
    // Section 6: FAQ - third plain section
    if (plainSections[2]) allSections.push({ el: plainSections[2], section: sections[5] });
    // Section 7: CTA Banner - inverse-section
    if (inverseSections[0]) allSections.push({ el: inverseSections[0], section: sections[6] });

    // Process in reverse order to avoid DOM position shifting
    for (let i = allSections.length - 1; i >= 0; i--) {
      const { el, section } = allSections[i];

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        el.append(sectionMetadata);
      }

      // Insert <hr> before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        el.before(hr);
      }
    }
  }
}
