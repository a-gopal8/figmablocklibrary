/* eslint-disable */
/* global WebImporter */

import heroProductParser from './parsers/hero-product.js';
import carouselShowcaseParser from './parsers/carousel-showcase.js';
import columnsStatsParser from './parsers/columns-stats.js';
import columnsCompareParser from './parsers/columns-compare.js';
import cardsProductParser from './parsers/cards-product.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsIconParser from './parsers/cards-icon.js';

import cleanupTransformer from './transformers/apple-cleanup.js';
import sectionsTransformer from './transformers/apple-sections.js';

const parsers = {
  'hero-product': heroProductParser,
  'carousel-showcase': carouselShowcaseParser,
  'columns-stats': columnsStatsParser,
  'columns-compare': columnsCompareParser,
  'cards-product': cardsProductParser,
  'columns-banner': columnsBannerParser,
  'cards-icon': cardsIconParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'iphone-product-page',
  description: 'Apple iPhone 17 product landing page with hero, features, specs, and promotional sections',
  urls: ['https://www.apple.com/uk/iphone-17/'],
  blocks: [
    {
      name: 'hero-product',
      instances: ['section.section-welcome'],
    },
    {
      name: 'carousel-showcase',
      instances: ['section.section-highlights .aap-media-card-gallery', 'section.section-cameras .aap-media-card-gallery', 'section.section-shared-features .aap-media-card-gallery'],
    },
    {
      name: 'columns-stats',
      instances: ['section.section-performance'],
    },
    {
      name: 'columns-compare',
      instances: ['section.section-upgrade', 'section.section-contrast'],
    },
    {
      name: 'cards-product',
      instances: ['section.section-accessories'],
    },
    {
      name: 'columns-banner',
      instances: ['section.section-upgrade-banner'],
    },
    {
      name: 'cards-icon',
      instances: ['section.section-incentive', 'section.section-environment', 'section.section-values'],
    },
  ],
  sections: [
    { id: 'section-1', name: 'Welcome Hero', selector: 'section.section-welcome', style: null, blocks: ['hero-product'], defaultContent: [] },
    { id: 'section-2', name: 'Highlights', selector: 'section.section-highlights', style: 'grey', blocks: ['carousel-showcase'], defaultContent: [] },
    { id: 'section-3', name: 'Design', selector: 'section.section-product-viewer', style: 'grey', blocks: [], defaultContent: [] },
    { id: 'section-4', name: 'Cameras', selector: 'section.section-cameras', style: null, blocks: ['carousel-showcase'], defaultContent: [] },
    { id: 'section-5', name: 'Performance', selector: 'section.section-performance', style: null, blocks: ['columns-stats'], defaultContent: [] },
    { id: 'section-6', name: 'Shared Features', selector: 'section.section-shared-features', style: 'grey', blocks: ['carousel-showcase'], defaultContent: [] },
    { id: 'section-7', name: 'Upgrade Comparison', selector: 'section.section-upgrade', style: null, blocks: ['columns-compare'], defaultContent: [] },
    { id: 'section-8', name: 'Accessories', selector: 'section.section-accessories', style: null, blocks: ['cards-product'], defaultContent: [] },
    { id: 'section-9', name: 'Upgrade Banner', selector: 'section.section-upgrade-banner', style: 'grey', blocks: ['columns-banner'], defaultContent: [] },
    { id: 'section-10', name: 'Incentives', selector: 'section.section-incentive', style: 'grey', blocks: ['cards-icon'], defaultContent: [] },
    { id: 'section-11', name: 'Product Lineup', selector: 'section.section-contrast', style: 'grey', blocks: ['columns-compare'], defaultContent: [] },
    { id: 'section-12', name: 'Environment', selector: 'section.section-environment', style: 'grey', blocks: ['cards-icon'], defaultContent: [] },
    { id: 'section-13', name: 'Values', selector: 'section.section-values', style: 'grey', blocks: ['cards-icon'], defaultContent: [] },
    { id: 'section-14', name: 'Site Index', selector: 'section.section-index', style: 'grey', blocks: [], defaultContent: [] },
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
