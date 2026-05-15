let sliderInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll("#announcement-slider .announcement-slide");
  const dots = document.getElementById("announcement-dots");
  if (slides.length && dots && dots.children.length === 0) {
    initAnnouncementSlider(slides.length);
  }
});

function initAnnouncementSlider(count) {
  const slider = document.getElementById("announcement-slider");
  const dotsContainer = document.getElementById("announcement-dots");
  if (!slider || !dotsContainer || count === 0) return;

  dotsContainer.innerHTML = "";
  let currentIndex = 0;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      currentIndex = i;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  }

  function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % count;
    updateSlider();
  }

  if (sliderInterval) clearInterval(sliderInterval);
  sliderInterval = setInterval(nextSlide, 4000);

  const container = document.querySelector(".announcement-container");
  if (container) {
    container.addEventListener("mouseenter", () => clearInterval(sliderInterval));
    container.addEventListener("mouseleave", () => {
      sliderInterval = setInterval(nextSlide, 4000);
    });
  }
}
