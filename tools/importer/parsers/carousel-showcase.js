/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-showcase
 * Base block: carousel
 * Source: https://www.apple.com/uk/iphone-17/
 * Generated: 2026-05-11
 *
 * Source structure: The matched element is .aap-media-card-gallery which contains only
 * navigation controls. The actual gallery slides (li.gallery-item) are in a sibling
 * .media-gallery-wrapper under the shared ancestor .media-card-gallery-content.
 * The parser navigates up to the ancestor to find slides.
 *
 * Each slide has a .media-block with video/picture elements and a .caption-container
 * with a p.caption text. Maps to Carousel block: image in cell 1, caption in cell 2.
 */
export default function parse(element, { document }) {
  // The matched element (.aap-media-card-gallery) only contains nav controls.
  // Navigate up to the common ancestor that also contains the gallery slides.
  // Hierarchy: .media-card-gallery-content > .all-access-pass__container > .aap-media-card-gallery
  // Slides are at: .media-card-gallery-content > .media-gallery-wrapper > .gallery > ul > li.gallery-item
  let container = element.closest('.media-card-gallery-content, .media-card-set');

  // Fallback: walk up to find the section-level container
  if (!container) {
    container = element.closest('section') || element.parentElement;
  }

  // Find all gallery slide items within the ancestor container
  const galleryItems = container.querySelectorAll('li.gallery-item, li.card-container');

  const cells = [];

  galleryItems.forEach((item) => {
    // --- Extract image ---
    // Each slide has multiple <picture> elements (fallback-frame, end-frame, start-frame).
    // Prefer the fallback-frame picture as it has meaningful alt text.
    const mediaBlock = item.querySelector('.media-block, .media-container');
    let img = null;

    if (mediaBlock) {
      // Try fallback-frame picture first (has proper alt text)
      const fallbackImg = mediaBlock.querySelector('picture.fallback-frame img[src], picture[class*="fallback-frame"] img[src]');
      if (fallbackImg && fallbackImg.getAttribute('src')) {
        img = fallbackImg;
      }

      // Fallback: first picture img with a non-empty alt attribute
      if (!img) {
        const allPictureImgs = mediaBlock.querySelectorAll('picture img[src]');
        for (const candidate of allPictureImgs) {
          if (candidate.getAttribute('alt')) {
            img = candidate;
            break;
          }
        }
        // Last fallback: first picture img with any src
        if (!img && allPictureImgs.length > 0) {
          img = allPictureImgs[0];
        }
      }

      // Also check for standalone images not inside <picture>
      if (!img) {
        img = mediaBlock.querySelector(':scope > img[src], img[src]');
      }
    }

    // --- Extract caption ---
    const captionContainer = item.querySelector('.caption-container');
    let captionEl = null;

    if (captionContainer) {
      // Validated selector from source HTML: p.caption
      captionEl = captionContainer.querySelector('p.caption, p[class*="caption"]');

      // Fallback: any paragraph in caption container
      if (!captionEl) {
        captionEl = captionContainer.querySelector('p');
      }
    }

    // --- Build row: [image cell, text cell] ---
    // Only add row if we have at least an image (mandatory per block library)
    if (img) {
      const textCell = [];

      if (captionEl) {
        textCell.push(captionEl);
      }

      if (textCell.length > 0) {
        cells.push([img, textCell]);
      } else {
        // Image only, no caption
        cells.push([img]);
      }
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-showcase', cells });
  element.replaceWith(block);
}
