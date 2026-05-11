/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-05-11
 *
 * Source structure: div.faq-list containing multiple details.faq-item elements,
 * each with a summary.faq-question (span text + icon) and div.faq-answer (paragraph content).
 *
 * Target structure: 2-column table with one row per FAQ item.
 *   Column 1: Question title text
 *   Column 2: Answer content
 */
export default function parse(element, { document }) {
  // The element is .faq-list containing details.faq-item children
  // Extract all FAQ items
  const faqItems = element.querySelectorAll('details.faq-item');

  // Fallback: if no .faq-item class, try plain details elements
  const items = faqItems.length > 0 ? faqItems : element.querySelectorAll('details');

  // Build cells array: each row is [title, content] per accordion library spec
  const cells = [];

  items.forEach((item) => {
    // Extract question text from summary > span, fallback to summary textContent
    const summary = item.querySelector('summary');
    if (!summary) return;

    const questionSpan = summary.querySelector('span');
    const questionText = questionSpan
      ? questionSpan.textContent.trim()
      : summary.textContent.trim();

    if (!questionText) return;

    // Extract answer content from .faq-answer, fallback to first div child
    const answerDiv = item.querySelector('.faq-answer') || item.querySelector('div');
    if (!answerDiv) return;

    // Title cell: reference the question span or create a paragraph
    const titleCell = questionSpan || summary;

    // Content cell: reference the answer div directly
    cells.push([titleCell, answerDiv]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
