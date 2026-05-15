/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-iphone-product-page.js
  var import_iphone_product_page_exports = {};
  __export(import_iphone_product_page_exports, {
    default: () => import_iphone_product_page_default
  });

  // tools/importer/parsers/hero-product.js
  function parse(element, { document }) {
    const eyebrow = element.querySelector("h1.header-eyebrow, .header-eyebrow");
    const headline = element.querySelector("p.header-headline, .header-headline");
    const heroImage = element.querySelector(
      '.inline-media-component-container picture.fallback-frame img, .inline-media-component-container picture img[alt]:not([alt=""]), .inline-media-component-container picture img'
    );
    const pricing = element.querySelector(
      "p.pricing-product, .marquee-pricing p, p.ric-dynamic-pricing"
    );
    const ctaLink = element.querySelector(
      'a.marquee-ctas-link, .marquee-detail a.button, .detail-inner-group > a, .marquee-bottom a[href]:not(.footnote a):not([href^="#footnote"])'
    );
    const cells = [];
    if (heroImage) {
      const pictureEl = heroImage.closest("picture");
      cells.push([pictureEl || heroImage]);
    }
    const contentContainer = document.createElement("div");
    if (eyebrow) {
      const eyebrowEl = document.createElement("h2");
      eyebrowEl.textContent = eyebrow.textContent.trim();
      contentContainer.appendChild(eyebrowEl);
    }
    if (headline) {
      const headlineEl = document.createElement("h1");
      headlineEl.textContent = headline.textContent.trim();
      contentContainer.appendChild(headlineEl);
    }
    if (pricing) {
      const pricingEl = document.createElement("p");
      pricingEl.textContent = pricing.textContent.trim();
      contentContainer.appendChild(pricingEl);
    }
    if (ctaLink && ctaLink.textContent.trim()) {
      const link = document.createElement("a");
      link.href = ctaLink.href || ctaLink.getAttribute("href");
      link.textContent = ctaLink.textContent.trim();
      const strong = document.createElement("strong");
      strong.appendChild(link);
      const p = document.createElement("p");
      p.appendChild(strong);
      contentContainer.appendChild(p);
    }
    if (contentContainer.childNodes.length > 0) {
      cells.push([contentContainer]);
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-product",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-showcase.js
  function parse2(element, { document }) {
    let container = element.closest(".media-card-gallery-content, .media-card-set");
    if (!container) {
      container = element.closest("section") || element.parentElement;
    }
    const galleryItems = container.querySelectorAll("li.gallery-item, li.card-container");
    const cells = [];
    galleryItems.forEach((item) => {
      const mediaBlock = item.querySelector(".media-block, .media-container");
      let img = null;
      if (mediaBlock) {
        const fallbackImg = mediaBlock.querySelector('picture.fallback-frame img[src], picture[class*="fallback-frame"] img[src]');
        if (fallbackImg && fallbackImg.getAttribute("src")) {
          img = fallbackImg;
        }
        if (!img) {
          const allPictureImgs = mediaBlock.querySelectorAll("picture img[src]");
          for (const candidate of allPictureImgs) {
            if (candidate.getAttribute("alt")) {
              img = candidate;
              break;
            }
          }
          if (!img && allPictureImgs.length > 0) {
            img = allPictureImgs[0];
          }
        }
        if (!img) {
          img = mediaBlock.querySelector(":scope > img[src], img[src]");
        }
      }
      const captionContainer = item.querySelector(".caption-container");
      let captionEl = null;
      if (captionContainer) {
        captionEl = captionContainer.querySelector('p.caption, p[class*="caption"]');
        if (!captionEl) {
          captionEl = captionContainer.querySelector("p");
        }
      }
      if (img) {
        const textCell = [];
        if (captionEl) {
          textCell.push(captionEl);
        }
        if (textCell.length > 0) {
          cells.push([img, textCell]);
        } else {
          cells.push([img]);
        }
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-showcase", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document }) {
    const visibleOption = element.querySelector(".inline-compare-option.show") || element.querySelector(".inline-compare-option:first-child");
    const statDivs = visibleOption ? Array.from(visibleOption.querySelectorAll(":scope > .ps-stat")) : [];
    const fallbackStats = statDivs.length > 0 ? statDivs : Array.from(element.querySelectorAll(".inline-compare-wrap .ps-stat"));
    const statCells = fallbackStats.map((statDiv) => {
      const statP = statDiv.querySelector(".ps-stat-p, p");
      if (statP) {
        const p2 = document.createElement("p");
        const spans = Array.from(statP.querySelectorAll(":scope > span"));
        spans.forEach((span) => {
          const brs = span.querySelectorAll("br");
          brs.forEach((br) => {
            br.replaceWith(document.createTextNode(" "));
          });
          const sups = span.querySelectorAll("sup.footnote");
          sups.forEach((sup) => sup.remove());
          if (span.classList.contains("gradient-wrapper")) {
            const strong = document.createElement("strong");
            strong.textContent = span.textContent.trim().replace(/\s+/g, " ");
            p2.appendChild(strong);
            p2.appendChild(document.createTextNode(" "));
          } else if (span.classList.contains("ps-stat-copy")) {
            p2.appendChild(document.createTextNode(span.textContent.trim().replace(/\s+/g, " ") + " "));
          }
        });
        if (p2.lastChild && p2.lastChild.nodeType === 3) {
          p2.lastChild.textContent = p2.lastChild.textContent.trimEnd();
        }
        return [p2];
      }
      const p = document.createElement("p");
      p.textContent = statDiv.textContent.trim().replace(/\s+/g, " ");
      return [p];
    });
    if (statCells.length === 0) {
      return;
    }
    const cells = [statCells.map((cell) => cell[0])];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "columns-stats",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-compare.js
  function parse4(element, { document }) {
    const isUpgradeSection = !!element.querySelector(".compare-tile, .compare-gallery");
    const isContrastSection = !!element.querySelector(".product-tile, .product-tile-contrast-container");
    const container = document.createElement("div");
    if (isUpgradeSection) {
      parseUpgradeSection(element, document, container);
    } else if (isContrastSection) {
      parseContrastSection(element, document, container);
    } else {
      parseUpgradeSection(element, document, container);
    }
    element.replaceWith(container);
  }
  function parseUpgradeSection(element, document, container) {
    const heading = element.querySelector("h2.copy-headline, h2");
    if (heading) {
      container.append(heading);
    }
    const eyebrow = element.querySelector("p.copy-eyebrow");
    if (eyebrow) {
      container.append(eyebrow);
    }
    const visibleOption = element.querySelector(".inline-compare-option.show");
    const tileContainer = visibleOption || element;
    const tiles = Array.from(tileContainer.querySelectorAll(".compare-tile"));
    const tileCells = tiles.map((tile) => {
      const cellContent = [];
      const tileCopy = tile.querySelector("p.tile-copy, p.ps-stat");
      if (tileCopy) {
        cellContent.push(tileCopy);
      }
      return cellContent;
    }).filter((cell) => cell.length > 0);
    const cells = [];
    for (let i = 0; i < tileCells.length; i += 2) {
      const row = [tileCells[i]];
      if (i + 1 < tileCells.length) {
        row.push(tileCells[i + 1]);
      }
      cells.push(row);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "columns-compare", cells });
      container.append(block);
    }
  }
  function parseContrastSection(element, document, container) {
    const heading = element.querySelector("h2");
    if (heading) {
      container.append(heading);
    }
    const headerCta = element.querySelector(".section-header-cta-link, .section-header a");
    if (headerCta) {
      const ctaParagraph = document.createElement("p");
      ctaParagraph.append(headerCta);
      container.append(ctaParagraph);
    }
    const productTiles = Array.from(element.querySelectorAll(".product-tile"));
    if (productTiles.length === 0) {
      return;
    }
    const row = productTiles.map((tile) => {
      const cellContent = [];
      const productImg = tile.querySelector(".product-tile-image img");
      if (productImg) {
        cellContent.push(productImg);
      }
      const headline = tile.querySelector(".product-tile-headline");
      if (headline) {
        const h3 = document.createElement("h3");
        h3.textContent = headline.textContent.trim();
        cellContent.push(h3);
      }
      const positioning = tile.querySelector(".product-tile-positioning");
      if (positioning) {
        cellContent.push(positioning);
      }
      const priceEl = tile.querySelector(".product-tile-price [data-pricing-product]");
      if (priceEl) {
        const priceParagraph = document.createElement("p");
        priceParagraph.textContent = priceEl.textContent.trim();
        cellContent.push(priceParagraph);
      }
      const ctaLinks = Array.from(tile.querySelectorAll(".product-tile-ctas a"));
      ctaLinks.forEach((link) => {
        cellContent.push(link);
      });
      return cellContent;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-compare", cells });
    container.append(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse5(element, { document }) {
    const cardItems = element.querySelectorAll("li.accessories-item, .accessories-item");
    const cells = [];
    cardItems.forEach((item) => {
      const picture = item.querySelector(".image-wrapper picture, .accessories-card picture");
      const img = item.querySelector(".image-wrapper img, .accessories-card img");
      const imageCell = picture || img;
      const heading = item.querySelector("h3.tile-header, .tile-header, .accessories-copy h3");
      const description = item.querySelector("p.tile-copy, .tile-copy, .accessories-copy p");
      const textContent = [];
      if (heading) textContent.push(heading);
      if (description) textContent.push(description);
      if (imageCell || textContent.length > 0) {
        cells.push([imageCell || "", textContent]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse6(element, { document }) {
    const headline = element.querySelector('.banner-card-headline, .banner-card-header, h2[class*="banner"]');
    const ctaLink = element.querySelector(".banner-card-cta, .banner-card-ctas a, a.button");
    const textContent = [];
    if (headline) {
      const h2 = document.createElement("h2");
      h2.textContent = headline.textContent.replace(/\s+/g, " ").trim();
      textContent.push(h2);
    }
    if (ctaLink) {
      const link = document.createElement("a");
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      const p = document.createElement("p");
      p.append(link);
      textContent.push(p);
    }
    const picture = element.querySelector(".banner-card-asset-column picture, .banner-card-image, picture");
    const img = picture ? picture.querySelector("img") : element.querySelector('.banner-card-asset-column img, img[class*="banner"]');
    const imageContent = [];
    if (img) {
      const newImg = document.createElement("img");
      newImg.src = img.src;
      newImg.alt = img.alt || "";
      imageContent.push(newImg);
    }
    const cells = [
      [textContent, imageContent]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse7(element, { document }) {
    const cards = element.querySelectorAll("li.card-container");
    const cells = [];
    cards.forEach((card) => {
      const imageCell = [];
      const contentCell = [];
      const isFeatureCard = !!card.querySelector(".feature-card-content");
      const isIconCard = !!card.querySelector(".icon-card-content");
      if (isFeatureCard) {
        const img = card.querySelector("figure.feature-card-image-container img, .feature-card-image-container img");
        if (img && !img.src.startsWith("data:")) {
          const imgEl = document.createElement("img");
          imgEl.src = img.src;
          if (img.alt) imgEl.alt = img.alt;
          imageCell.push(imgEl);
        }
        const label = card.querySelector("h3.feature-card-label, .feature-card-label");
        if (label) {
          const heading = document.createElement("h3");
          heading.textContent = label.textContent.trim();
          contentCell.push(heading);
        }
        const headline = card.querySelector("p.feature-card-headline, .feature-card-headline");
        if (headline) {
          const p = document.createElement("p");
          p.textContent = headline.textContent.trim();
          contentCell.push(p);
        }
        const body = card.querySelector("p.feature-card-body, .feature-card-body");
        if (body && body.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = body.textContent.trim();
          contentCell.push(p);
        }
        const link = card.querySelector("a.card-control");
        if (link && link.href) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = label ? label.textContent.trim() : "Learn more";
          const linkP = document.createElement("p");
          linkP.appendChild(a);
          contentCell.push(linkP);
        }
      } else if (isIconCard) {
        const img = card.querySelector(".icon-card-icon-wrapper img, .icon-card-icon img");
        if (img && !img.src.startsWith("data:")) {
          const imgEl = document.createElement("img");
          imgEl.src = img.src;
          if (img.alt) imgEl.alt = img.alt;
          imageCell.push(imgEl);
        }
        const headline = card.querySelector("h3.icon-card-headline, .icon-card-headline");
        if (headline) {
          const heading = document.createElement("h3");
          heading.textContent = headline.textContent.trim();
          contentCell.push(heading);
        }
        const bodyCopy = card.querySelector("p.icon-card-body-copy, .icon-card-body-copy");
        if (bodyCopy && bodyCopy.textContent.trim()) {
          const p = document.createElement("p");
          p.textContent = bodyCopy.textContent.trim();
          contentCell.push(p);
        }
        const actionLink = card.querySelector("a.action-handler");
        const cardControlLink = card.querySelector("a.card-control");
        if (actionLink && actionLink.href) {
          const a = document.createElement("a");
          a.href = actionLink.href;
          const iconCopy = actionLink.querySelector(".icon-copy");
          a.textContent = iconCopy ? iconCopy.textContent.trim() : "Learn more";
          const linkP = document.createElement("p");
          linkP.appendChild(a);
          contentCell.push(linkP);
        } else if (cardControlLink && cardControlLink.href) {
          const a = document.createElement("a");
          a.href = cardControlLink.href;
          const headline2 = card.querySelector("h3");
          a.textContent = headline2 ? headline2.textContent.trim() : "Learn more";
          const linkP = document.createElement("p");
          linkP.appendChild(a);
          contentCell.push(linkP);
        }
      }
      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icon", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/apple-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#ac-localeswitcher",
        ".ric-modal"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "#globalheader",
        "#localnav",
        "#ac-globalfooter",
        ".ac-gf-sosumi",
        ".ac-gf-breadcrumbs",
        ".ac-gf-directory",
        "section.section-incentive-alt",
        "nav",
        "footer",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/apple-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-iphone-product-page.js
  var parsers = {
    "hero-product": parse,
    "carousel-showcase": parse2,
    "columns-stats": parse3,
    "columns-compare": parse4,
    "cards-product": parse5,
    "columns-banner": parse6,
    "cards-icon": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "iphone-product-page",
    description: "Apple iPhone 17 product landing page with hero, features, specs, and promotional sections",
    urls: ["https://www.apple.com/uk/iphone-17/"],
    blocks: [
      {
        name: "hero-product",
        instances: ["section.section-welcome"]
      },
      {
        name: "carousel-showcase",
        instances: ["section.section-highlights .aap-media-card-gallery", "section.section-cameras .aap-media-card-gallery", "section.section-shared-features .aap-media-card-gallery"]
      },
      {
        name: "columns-stats",
        instances: ["section.section-performance"]
      },
      {
        name: "columns-compare",
        instances: ["section.section-upgrade", "section.section-contrast"]
      },
      {
        name: "cards-product",
        instances: ["section.section-accessories"]
      },
      {
        name: "columns-banner",
        instances: ["section.section-upgrade-banner"]
      },
      {
        name: "cards-icon",
        instances: ["section.section-incentive", "section.section-environment", "section.section-values"]
      }
    ],
    sections: [
      { id: "section-1", name: "Welcome Hero", selector: "section.section-welcome", style: null, blocks: ["hero-product"], defaultContent: [] },
      { id: "section-2", name: "Highlights", selector: "section.section-highlights", style: "grey", blocks: ["carousel-showcase"], defaultContent: [] },
      { id: "section-3", name: "Design", selector: "section.section-product-viewer", style: "grey", blocks: [], defaultContent: [] },
      { id: "section-4", name: "Cameras", selector: "section.section-cameras", style: null, blocks: ["carousel-showcase"], defaultContent: [] },
      { id: "section-5", name: "Performance", selector: "section.section-performance", style: null, blocks: ["columns-stats"], defaultContent: [] },
      { id: "section-6", name: "Shared Features", selector: "section.section-shared-features", style: "grey", blocks: ["carousel-showcase"], defaultContent: [] },
      { id: "section-7", name: "Upgrade Comparison", selector: "section.section-upgrade", style: null, blocks: ["columns-compare"], defaultContent: [] },
      { id: "section-8", name: "Accessories", selector: "section.section-accessories", style: null, blocks: ["cards-product"], defaultContent: [] },
      { id: "section-9", name: "Upgrade Banner", selector: "section.section-upgrade-banner", style: "grey", blocks: ["columns-banner"], defaultContent: [] },
      { id: "section-10", name: "Incentives", selector: "section.section-incentive", style: "grey", blocks: ["cards-icon"], defaultContent: [] },
      { id: "section-11", name: "Product Lineup", selector: "section.section-contrast", style: "grey", blocks: ["columns-compare"], defaultContent: [] },
      { id: "section-12", name: "Environment", selector: "section.section-environment", style: "grey", blocks: ["cards-icon"], defaultContent: [] },
      { id: "section-13", name: "Values", selector: "section.section-values", style: "grey", blocks: ["cards-icon"], defaultContent: [] },
      { id: "section-14", name: "Site Index", selector: "section.section-index", style: "grey", blocks: [], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_iphone_product_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_iphone_product_page_exports);
})();
