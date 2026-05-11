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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-editorial.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, p[class*="subheading"], .grid-layout > div > p');
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a, a.button, a.secondary-button")
    );
    const images = Array.from(
      element.querySelectorAll("img.cover-image, .grid-layout img")
    );
    const cells = [];
    if (images.length > 0) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-featured.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const imageCol = columns[0];
    const image = imageCol ? imageCol.querySelector('img.cover-image, img[class*="cover"], img') : null;
    const textCol = columns[1];
    const leftCell = [];
    if (image) {
      leftCell.push(image);
    }
    const rightCell = [];
    if (textCol) {
      const breadcrumbs = textCol.querySelector(".breadcrumbs");
      if (breadcrumbs) {
        rightCell.push(breadcrumbs);
      }
      const heading = textCol.querySelector('h2, h1, h3, [class*="heading"]');
      if (heading) {
        rightCell.push(heading);
      }
      const metaDivs = textCol.querySelectorAll(":scope > div:not(.breadcrumbs)");
      metaDivs.forEach((metaDiv) => {
        if (metaDiv.querySelector('.flex-horizontal, [class*="flex"]')) {
          rightCell.push(metaDiv);
        }
      });
    }
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse3(element, { document }) {
    const cardDivs = element.querySelectorAll(":scope > div");
    const cells = [];
    cardDivs.forEach((cardDiv) => {
      const img = cardDiv.querySelector("img");
      if (img) {
        cells.push([img]);
      }
    });
    if (cells.length === 0) {
      const allImages = element.querySelectorAll("img");
      allImages.forEach((img) => {
        cells.push([img]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu-link, .tab-menu button");
    const cells = [];
    tabPanes.forEach((pane, index) => {
      let labelText = "Tab " + (index + 1);
      if (tabButtons[index]) {
        const strong = tabButtons[index].querySelector("strong");
        if (strong) labelText = strong.textContent.trim();
      } else {
        const strong = pane.querySelector("strong");
        if (strong) labelText = strong.textContent.trim();
      }
      const panelContent = [];
      const img = pane.querySelector("img");
      if (img) panelContent.push(img);
      const nameStrong = pane.querySelector(".paragraph-xl strong, strong");
      if (nameStrong) {
        const p = document.createElement("p");
        const s = document.createElement("strong");
        s.textContent = nameStrong.textContent.trim();
        p.appendChild(s);
        panelContent.push(p);
      }
      const nameDiv = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameDiv && nameDiv.nextElementSibling && !nameDiv.nextElementSibling.classList.contains("paragraph-xl")) {
        const roleP = document.createElement("p");
        roleP.textContent = nameDiv.nextElementSibling.textContent.trim();
        panelContent.push(roleP);
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) {
        const quoteP = document.createElement("p");
        quoteP.textContent = quote.textContent.trim();
        panelContent.push(quoteP);
      }
      cells.push([labelText, panelContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    let targetElement = element;
    const hasArticleCards = element.querySelector("a.article-card, a.card-link");
    if (!hasArticleCards) {
      const section = element.closest("section") || element.parentElement;
      const parentContainer = section ? section.parentElement : document;
      const allGrids = parentContainer.querySelectorAll(".grid-layout.desktop-4-column");
      for (let i = 0; i < allGrids.length; i += 1) {
        if (allGrids[i].querySelector("a.article-card, a.card-link")) {
          targetElement = allGrids[i];
          break;
        }
      }
    }
    const cards = targetElement.querySelectorAll("a.article-card, a.card-link");
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("img");
      const tag = card.querySelector(".tag, span:first-child");
      const meta = card.querySelectorAll("span");
      const date = meta.length > 1 ? meta[1] : null;
      const heading = card.querySelector('h3, h4, [class*="heading"]');
      const imageCell = image ? [image] : [];
      const bodyCell = [];
      if (tag && tag.textContent.trim()) {
        const tagP = document.createElement("p");
        tagP.append(document.createTextNode(tag.textContent.trim()));
        bodyCell.push(tagP);
      }
      if (date && date.textContent.trim()) {
        const dateP = document.createElement("p");
        dateP.append(document.createTextNode(date.textContent.trim()));
        bodyCell.push(dateP);
      }
      const href = card.getAttribute("href");
      if (heading && heading.textContent.trim()) {
        const h3 = document.createElement("h3");
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.append(document.createTextNode(heading.textContent.trim()));
          h3.append(link);
        } else {
          h3.append(document.createTextNode(heading.textContent.trim()));
        }
        bodyCell.push(h3);
      }
      if (imageCell.length > 0 || bodyCell.length > 0) {
        cells.push([imageCell, bodyCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item");
    const items = faqItems.length > 0 ? faqItems : element.querySelectorAll("details");
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary");
      if (!summary) return;
      const questionSpan = summary.querySelector("span");
      const questionText = questionSpan ? questionSpan.textContent.trim() : summary.textContent.trim();
      if (!questionText) return;
      const answerDiv = item.querySelector(".faq-answer") || item.querySelector("div");
      if (!answerDiv) return;
      const titleCell = questionSpan || summary;
      cells.push([titleCell, answerDiv]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-cta.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="cover"], .grid-layout img');
    const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');
    const description = element.querySelector('p.subheading, p[class*="subheading"], .card-body p, .utility-text-on-overlay p');
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a, a.button, a.inverse-button")
    );
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push([contentCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const allSections = [];
      const hero = element.querySelector("header.section.secondary-section");
      if (hero) allSections.push({ el: hero, section: sections[0] });
      const sectionEls = element.querySelectorAll("section.section");
      const secondarySections = [];
      const plainSections = [];
      const inverseSections = [];
      sectionEls.forEach((sec) => {
        if (sec.classList.contains("inverse-section")) {
          inverseSections.push(sec);
        } else if (sec.classList.contains("secondary-section")) {
          secondarySections.push(sec);
        } else {
          plainSections.push(sec);
        }
      });
      if (plainSections[0]) allSections.push({ el: plainSections[0], section: sections[1] });
      if (secondarySections[0]) allSections.push({ el: secondarySections[0], section: sections[2] });
      if (plainSections[1]) allSections.push({ el: plainSections[1], section: sections[3] });
      if (secondarySections[1]) allSections.push({ el: secondarySections[1], section: sections[4] });
      if (plainSections[2]) allSections.push({ el: plainSections[2], section: sections[5] });
      if (inverseSections[0]) allSections.push({ el: inverseSections[0], section: sections[6] });
      for (let i = allSections.length - 1; i >= 0; i--) {
        const { el, section } = allSections[i];
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          el.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          el.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-editorial": parse,
    "columns-featured": parse2,
    "cards-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-cta": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "WKND Trendsetters homepage with hero, featured content, and promotional sections",
    urls: ["https://wknd-trendsetters.site/"],
    blocks: [
      {
        name: "hero-editorial",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-featured",
        instances: ["section.section:nth-of-type(1) > .container > .grid-layout"]
      },
      {
        name: "cards-gallery",
        instances: ["section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["section.section.secondary-section:nth-of-type(2) .grid-layout.desktop-4-column"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-cta",
        instances: ["section.section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: null,
        blocks: ["hero-editorial"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "main > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-featured"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Gallery",
        selector: "main > section.section.secondary-section:nth-of-type(1)",
        style: "grey",
        blocks: ["cards-gallery"],
        defaultContent: [".utility-text-align-center h2", ".utility-text-align-center p"]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "main > section.section:nth-of-type(2)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "main > section.section.secondary-section:nth-of-type(2)",
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: [".utility-text-align-center h2", ".utility-text-align-center p"]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "main > section.section:nth-of-type(3)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: ["h2.h2-heading", "p.subheading"]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.section.inverse-section",
        style: null,
        blocks: ["hero-cta"],
        defaultContent: []
      }
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
  var import_homepage_default = {
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
  return __toCommonJS(import_homepage_exports);
})();
