export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'featured-article-inner';

  rows.forEach((row) => {
    const picture = row.querySelector('picture');
    const cols = [...row.children];

    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'featured-article-image';
      imgWrap.append(picture);
      container.append(imgWrap);
    }

    cols.forEach((col) => {
      if (!col.querySelector('picture')) {
        const overlay = document.createElement('div');
        overlay.className = 'featured-article-content';
        while (col.firstChild) overlay.append(col.firstChild);
        container.append(overlay);
      }
    });
  });

  block.replaceChildren(container);
}
