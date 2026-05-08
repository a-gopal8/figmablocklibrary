export default function decorate(block) {
  const rows = [...block.children];
  const container = document.createElement('div');
  container.className = 'newsletter-inner';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const heading = col.querySelector('h2, h3');
      const picture = col.querySelector('picture');

      if (heading) {
        const titleWrap = document.createElement('div');
        titleWrap.className = 'newsletter-title';
        titleWrap.append(heading);

        const form = document.createElement('div');
        form.className = 'newsletter-form';
        const input = document.createElement('input');
        input.type = 'email';
        input.placeholder = 'your-email@example.com';
        const button = document.createElement('button');
        button.className = 'newsletter-submit';
        button.setAttribute('aria-label', 'Subscribe');
        button.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M12 6l4 4-4 4" stroke="#ebeef3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        form.append(input);
        form.append(button);
        titleWrap.append(form);
        container.append(titleWrap);
      } else if (picture) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'newsletter-image';
        imgWrap.append(picture);
        container.append(imgWrap);
      }
    });
  });

  block.replaceChildren(container);
}
