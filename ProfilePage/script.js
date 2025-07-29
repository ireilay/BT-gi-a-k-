const track = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dotsContainer = document.querySelector('.slider-dots');
let cards = document.querySelectorAll('.project-card');

let currentIndex = 0;
let cardsPerView = getCardsPerView();
let slideWidth = 0;
let dotElements = [];

function getCardsPerView() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function cloneCards() {
  cards = document.querySelectorAll('.project-card');
  cardsPerView = getCardsPerView();
  slideWidth = cards[0].offsetWidth + 20;

  const totalCards = cards.length;
  const clonesStart = [];
  const clonesEnd = [];

  for (let i = 0; i < cardsPerView; i++) {
    clonesEnd.push(cards[i].cloneNode(true));
    clonesStart.push(cards[totalCards - 1 - i].cloneNode(true));
  }

  clonesStart.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
  clonesEnd.forEach(clone => track.appendChild(clone));
}

function slideTo(index, smooth = true) {
  const totalRealCards = document.querySelectorAll('.project-card').length - cardsPerView * 2;
  const maxIndex = totalRealCards;

  currentIndex = index;

  track.style.transition = smooth ? 'transform 0.4s ease-in-out' : 'none';
  track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  updateDots();

  track.addEventListener('transitionend', () => {
    if (currentIndex >= maxIndex + cardsPerView) {
      currentIndex = cardsPerView;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      updateDots();
    }
    if (currentIndex < cardsPerView) {
      currentIndex = maxIndex;
      track.style.transition = 'none';
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
      updateDots();
    }
  }, { once: true });
}

function createDots() {
  const totalRealCards = document.querySelectorAll('.project-card').length - cardsPerView * 2;
  const totalSlides = totalRealCards;

  dotsContainer.innerHTML = '';
  dotElements = [];

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      slideTo(i + cardsPerView); // account for clones
    });
    dotsContainer.appendChild(dot);
    dotElements.push(dot);
  }
}

function updateDots() {
  const visibleIndex = (currentIndex - cardsPerView + dotElements.length) % dotElements.length;
  dotElements.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === visibleIndex);
  });
}

function initSlider() {
  cloneCards();
  currentIndex = getCardsPerView(); // Start after clones
  setTimeout(() => {
    slideTo(currentIndex, false);
    createDots();
  }, 50);
}

nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));
prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
window.addEventListener('resize', () => location.reload());
window.addEventListener('load', initSlider);
