const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxStage = document.querySelector(".lightbox-stage");

let activeLightboxGroup = [];
let activeLightboxIndex = 0;

const showLightboxItem = (index) => {
  if (!lightboxImage || activeLightboxGroup.length === 0) return;
  activeLightboxIndex = (index + activeLightboxGroup.length) % activeLightboxGroup.length;
  const trigger = activeLightboxGroup[activeLightboxIndex];
  const src = trigger.dataset.lightbox;
  const img = trigger.querySelector("img");
  if (!src) return;
  lightboxImage.src = src;
  lightboxImage.alt = img?.getAttribute("alt") || "Фото гостевого дома Oleganna";
  if (lightboxCounter) {
    lightboxCounter.textContent = `${activeLightboxIndex + 1} / ${activeLightboxGroup.length}`;
  }
};

const openLightbox = (trigger) => {
  if (!(trigger instanceof HTMLElement) || !lightbox || !lightboxImage) return;
  const groupName = trigger.dataset.lightboxGroup || "default";
  activeLightboxGroup = Array.from(document.querySelectorAll(`[data-lightbox-group="${groupName}"]`));
  activeLightboxIndex = Math.max(activeLightboxGroup.indexOf(trigger), 0);
  showLightboxItem(activeLightboxIndex);
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

  let touchStartX = 0;
  let touchDeltaX = 0;

  track?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  track?.addEventListener("touchmove", (event) => {
    touchDeltaX = event.touches[0].clientX - touchStartX;
  }, { passive: true });

  track?.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 40) return;
    current = touchDeltaX < 0
      ? (current + 1) % slides.length
      : (current - 1 + slides.length) % slides.length;
    updateCarousel();
  });

  updateCarousel();
});

lightboxPrev?.addEventListener("click", () => {
  showLightboxItem(activeLightboxIndex - 1);
});

lightboxNext?.addEventListener("click", () => {
  showLightboxItem(activeLightboxIndex + 1);
});

let lightboxTouchStartX = 0;
let lightboxTouchDeltaX = 0;

lightboxStage?.addEventListener("touchstart", (event) => {
  lightboxTouchStartX = event.touches[0].clientX;
  lightboxTouchDeltaX = 0;
}, { passive: true });

lightboxStage?.addEventListener("touchmove", (event) => {
  lightboxTouchDeltaX = event.touches[0].clientX - lightboxTouchStartX;
}, { passive: true });

lightboxStage?.addEventListener("touchend", () => {
  if (Math.abs(lightboxTouchDeltaX) < 40) return;
  showLightboxItem(lightboxTouchDeltaX < 0 ? activeLightboxIndex + 1 : activeLightboxIndex - 1);
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
  if (lightbox?.open && event.key === "ArrowLeft") {
    showLightboxItem(activeLightboxIndex - 1);
  }
  if (lightbox?.open && event.key === "ArrowRight") {
    showLightboxItem(activeLightboxIndex + 1);
  }
});
