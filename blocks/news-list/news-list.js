export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'news-list-container';

  const listSection = document.createElement('div');
  listSection.className = 'news-list-items';

  const featuredSection = document.createElement('div');
  featuredSection.className = 'news-list-featured';

  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (index === rows.length - 1 && cols.length >= 2) {
      const picture = row.querySelector('picture');
      const texts = row.querySelectorAll('p, h3, h4');
      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'news-list-featured-image';
        imgWrap.append(picture);
        featuredSection.append(imgWrap);
      }
      const overlay = document.createElement('div');
      overlay.className = 'news-list-featured-overlay';
      texts.forEach((t) => overlay.append(t.cloneNode(true)));
      featuredSection.append(overlay);
    } else {
      const item = document.createElement('div');
      item.className = 'news-list-item';

      const picture = row.querySelector('picture');
      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'news-list-item-image';
        imgWrap.append(picture);
        item.append(imgWrap);
      }

      const body = document.createElement('div');
      body.className = 'news-list-item-body';
      cols.forEach((col) => {
        if (!col.querySelector('picture')) {
          while (col.firstChild) body.append(col.firstChild);
        }
      });
      item.append(body);
      listSection.append(item);
    }
  });

  container.append(listSection);
  container.append(featuredSection);
  block.replaceChildren(container);
}
