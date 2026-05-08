export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  table.className = 'club-ranking-table';

  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    const cols = [...row.children];

    cols.forEach((col) => {
      const cell = document.createElement(index === 0 ? 'th' : 'td');
      cell.textContent = col.textContent.trim();
      tr.append(cell);
    });

    if (index === 0) {
      const thead = table.querySelector('thead') || document.createElement('thead');
      thead.append(tr);
      if (!table.querySelector('thead')) table.append(thead);
    } else {
      const tbody = table.querySelector('tbody') || document.createElement('tbody');
      tbody.append(tr);
      if (!table.querySelector('tbody')) table.append(tbody);
    }
  });

  block.replaceChildren(table);
}
