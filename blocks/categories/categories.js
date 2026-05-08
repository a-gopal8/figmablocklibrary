export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'categories-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const item = document.createElement('div');
      item.className = 'categories-item';

      const picture = col.querySelector('picture');
      const text = col.querySelector('p, h3, h4');

      if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'categories-item-image';
        imgWrap.append(picture);
        item.append(imgWrap);
      }

      if (text) {
        const label = document.createElement('div');
        label.className = 'categories-item-label';
        label.textContent = text.textContent;
        item.append(label);
      }

      grid.append(item);
    });
  });

  block.replaceChildren(grid);
}
