// Array of image paths
const images = [
  'images/photo1.jpg',
  'images/photo2.jpg',
  'images/photo3.jpg',
  'images/photo4.jpg'
];

// Track current slide
let currentIndex = 0;

// Grab DOM elements
const slideEl = document.getElementById('slide');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

/**
 * Render the current slide
 */
function renderSlide() {
  slideEl.src = images[currentIndex];
  slideEl.alt = `Slide ${currentIndex + 1}`;
}

/**
 * Advance to next slide (wraps)
 */
function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  renderSlide();
}

/**
 * Go back to previous slide (wraps)
 */
function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  renderSlide();
}

// Hook up buttons
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Initialize on page load
window.addEventListener('DOMContentLoaded', renderSlide);
