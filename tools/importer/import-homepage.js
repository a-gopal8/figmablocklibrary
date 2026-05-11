/* eslint-disable */
/* global WebImporter */

import heroEditorialParser from './parsers/hero-editorial.js';
import columnsFeaturedParser from './parsers/columns-featured.js';
import cardsGalleryParser from './parsers/cards-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroCtaParser from './parsers/hero-cta.js';

import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-editorial': heroEditorialParser,
  'columns-featured': columnsFeaturedParser,
  'cards-gallery': cardsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-cta': heroCtaParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'WKND Trendsetters homepage with hero, featured content, and promotional sections',
  urls: ['https://wknd-trendsetters.site/'],
  blocks: [
    {
      name: 'hero-editorial',
      instances: ['header.section.secondary-section'],
    },
    {
      name: 'columns-featured',
      instances: ['section.section:nth-of-type(1) > .container > .grid-layout'],
    },
    {
      name: 'cards-gallery',
      instances: ['section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'hero-cta',
      instances: ['section.section.inverse-section'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'header.section.secondary-section',
      style: null,
      blocks: ['hero-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'main > section.section:nth-of-type(1)',
      style: null,
      blocks: ['columns-featured'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Gallery',
      selector: 'main > section.section.secondary-section:nth-of-type(1)',
      style: 'grey',
      blocks: ['cards-gallery'],
      defaultContent: ['.utility-text-align-center h2', '.utility-text-align-center p'],
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: 'main > section.section:nth-of-type(2)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Latest Articles',
      selector: 'main > section.section.secondary-section:nth-of-type(2)',
      style: 'grey',
      blocks: ['cards-article'],
      defaultContent: ['.utility-text-align-center h2', '.utility-text-align-center p'],
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'main > section.section:nth-of-type(3)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['h2.h2-heading', 'p.subheading'],
    },
    {
      id: 'section-7',
      name: 'CTA Banner',
      selector: 'section.section.inverse-section',
      style: null,
      blocks: ['hero-cta'],
      defaultContent: [],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
