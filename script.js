const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const openLightbox = (trigger) => {
  if (!(trigger instanceof HTMLElement) || !lightbox || !lightboxImage) return;
  const src = trigger.dataset.lightbox;
  const img = trigger.querySelector("img");
  if (!src) return;
  lightboxImage.src = src;
  lightboxImage.alt = img?.getAttribute("alt") || "Фото гостевого дома Oleganna";
  lightbox.showModal();
};

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll("[data-lightbox]").forEach((button) => {
  button.addEventListener("click", () => {
    openLightbox(button);
  });
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".room-carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".room-slide"));
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  const counter = carousel.querySelector("[data-carousel-counter]");
  let current = 0;

  const updateCarousel = () => {
    if (!(track instanceof HTMLElement)) return;
    track.style.transform = `translateX(-${current * 100}%)`;
    if (counter) {
      counter.textContent = `${current + 1} / ${slides.length}`;
    }
  };

  prev?.addEventListener("click", () => {
    current = (current - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  next?.addEventListener("click", () => {
    current = (current + 1) % slides.length;
    updateCarousel();
  });

  updateCarousel();
});

lightboxClose?.addEventListener("click", () => {
  lightbox?.close();
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});
