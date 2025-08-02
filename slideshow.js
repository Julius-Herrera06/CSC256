
const images = [
  'photo1.jpg',
  'photo2.jpg',
  'photo3.jpg',
  'photo4.jpg'
];

let currentIndex = 0;
const slideEl = document.getElementById('slide');
const prevBtn  = document.getElementById('prev');
const nextBtn  = document.getElementById('next');

function renderSlide() {
  slideEl.src = images[currentIndex];
  slideEl.alt = `Slide ${currentIndex + 1}`;
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  renderSlide();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  renderSlide();
}

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);
window.addEventListener('DOMContentLoaded', renderSlide);
