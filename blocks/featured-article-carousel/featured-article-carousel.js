export default function decorate(block) {
  const slides = [...block.children];
  const container = document.createElement('div');
  container.className = 'carousel-container';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide, index) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'carousel-slide';
    if (index === 0) slideEl.classList.add('active');

    const picture = slide.querySelector('picture');
    const cols = [...slide.children];

    if (picture) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'carousel-slide-image';
      imgWrap.append(picture);
      slideEl.append(imgWrap);
    }

    cols.forEach((col) => {
      if (!col.querySelector('picture') && col.children.length > 0) {
        const overlay = document.createElement('div');
        overlay.className = 'carousel-slide-content';
        while (col.firstChild) overlay.append(col.firstChild);
        slideEl.append(overlay);
      }
    });

    track.append(slideEl);
  });

  container.append(track);

  // Pagination
  const pagination = document.createElement('div');
  pagination.className = 'carousel-pagination';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '←';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '→';

  const numbers = document.createElement('div');
  numbers.className = 'carousel-numbers';

  slides.forEach((_, i) => {
    const num = document.createElement('button');
    num.className = 'carousel-number';
    if (i === 0) num.classList.add('active');
    num.textContent = i + 1;
    num.setAttribute('aria-label', `Go to slide ${i + 1}`);
    numbers.append(num);
  });

  pagination.append(prevBtn);
  pagination.append(numbers);
  pagination.append(nextBtn);
  container.append(pagination);

  block.replaceChildren(container);

  // Carousel logic
  let current = 0;
  const allSlides = track.querySelectorAll('.carousel-slide');
  const allNumbers = numbers.querySelectorAll('.carousel-number');

  function goTo(index) {
    allSlides[current].classList.remove('active');
    allNumbers[current].classList.remove('active');
    current = (index + allSlides.length) % allSlides.length;
    allSlides[current].classList.add('active');
    allNumbers[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  allNumbers.forEach((num, i) => {
    num.addEventListener('click', () => goTo(i));
  });
}
