const scrollIndicator = document.querySelector(".scroll-indicator");
const disclaimerBlock = document.querySelector(".disclaimer-block");

let ticking = false;

const updateScrollIndicator = () => {
  if (!scrollIndicator) return;

  const page = document.documentElement;
  const canScroll = page.scrollHeight > window.innerHeight + 8;
  const isNearTop = window.scrollY <= 80;
  scrollIndicator.classList.toggle("is-hidden", !canScroll || !isNearTop);
  ticking = false;
};

const requestIndicatorUpdate = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScrollIndicator);
};

if (scrollIndicator && disclaimerBlock) {
  scrollIndicator.addEventListener("click", () => {
    disclaimerBlock.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener("scroll", requestIndicatorUpdate, { passive: true });
  window.addEventListener("resize", requestIndicatorUpdate, { passive: true });
  updateScrollIndicator();
}
