import { loadCSS } from '../../scripts/aem.js';

export default function decorate(block) {
  if (block.classList.contains('sport-news')) {
    loadCSS(`${window.hlx.codeBasePath}/blocks/hero/hero-sport-news.css`);
  }
}
