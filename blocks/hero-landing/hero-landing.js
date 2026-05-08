export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'hero-landing-inner';

  // First row: hero content (image + text)
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-landing-content';

  // Second row (if exists): sidebar news cards
  const sidebar = document.createElement('div');
  sidebar.className = 'hero-landing-sidebar';

  rows.forEach((row, index) => {
    const cols = [...row.children];

    if (index === 0) {
      // Hero row: first col = image, second col = text content
      cols.forEach((col) => {
        const picture = col.querySelector('picture');
        if (picture) {
          const imgWrap = document.createElement('div');
          imgWrap.className = 'hero-landing-image';
          imgWrap.append(picture);
          heroContent.append(imgWrap);
        } else if (col.children.length > 0) {
          const textWrap = document.createElement('div');
          textWrap.className = 'hero-landing-text';
          while (col.firstChild) textWrap.append(col.firstChild);
          heroContent.append(textWrap);
        }
      });
    } else {
      // Sidebar rows: each row is a news card
      const cols2 = [...row.children];
      const card = document.createElement('div');
      card.className = 'hero-landing-card';

      cols2.forEach((col) => {
        const picture = col.querySelector('picture');
        if (picture) {
          const cardImg = document.createElement('div');
          cardImg.className = 'hero-landing-card-image';
          cardImg.append(picture);
          card.append(cardImg);
        } else if (col.children.length > 0) {
          const cardText = document.createElement('div');
          cardText.className = 'hero-landing-card-text';
          while (col.firstChild) cardText.append(col.firstChild);
          card.append(cardText);
        }
      });

      sidebar.append(card);
    }
  });

  container.append(heroContent);
  if (sidebar.children.length > 0) {
    container.append(sidebar);
  }

  block.replaceChildren(container);
}
