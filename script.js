const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxStage = document.querySelector(".lightbox-stage");

const occupancyPublic = document.querySelector("[data-occupancy-public]");
const adminTrigger = document.querySelector("[data-admin-trigger]");
const adminDialog = document.querySelector("[data-admin-dialog]");
const adminDialogClose = document.querySelector("[data-admin-dialog-close]");
const adminLoginForm = document.querySelector("[data-admin-login-form]");
const adminEditor = document.querySelector("[data-admin-editor]");
const adminMessage = document.querySelector("[data-admin-message]");
const adminSaveMessage = document.querySelector("[data-admin-save-message]");
const adminPanel = document.querySelector("[data-admin-panel]");
const adminSaveButton = document.querySelector("[data-admin-save]");
const adminLogoutButton = document.querySelector("[data-admin-logout]");

const ADMIN_LOGIN = "theblady";
const ADMIN_PASSWORD = "13user13";
const OCCUPANCY_STORAGE_KEY = "oleganna-occupancy";
const ADMIN_SESSION_KEY = "oleganna-admin-session";

const defaultOccupancy = [
  {
    id: "standard",
    title: "Стандарт",
    status: "free",
    period: "Свободен сейчас",
    summary: "Подходит для спокойного короткого отдыха у моря.",
    note: "Можно уточнить заезд по телефону или в WhatsApp."
  },
  {
    id: "comfort",
    title: "Стандарт улучшенный",
    status: "busy",
    period: "Занят до 12 мая",
    summary: "Более просторный вариант для пары или семьи.",
    note: "Освобождение и ближайшие даты лучше уточнять заранее."
  },
  {
    id: "family",
    title: "Этаж семейный",
    status: "hold",
    period: "На подтверждении",
    summary: "Удобен для большой семьи или компании.",
    note: "Идёт подтверждение брони, статус может измениться в течение дня."
  }
];

let activeLightboxGroup = [];
let activeLightboxIndex = 0;
let occupancyState = loadOccupancy();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getStatusMeta(status) {
  const dictionary = {
    free: { label: "Свободен", className: "status-free" },
    busy: { label: "Занят", className: "status-busy" },
    hold: { label: "На подтверждении", className: "status-hold" }
  };

  return dictionary[status] || dictionary.free;
}

function loadOccupancy() {
  const raw = window.localStorage.getItem(OCCUPANCY_STORAGE_KEY);
  if (!raw) return structuredClone(defaultOccupancy);

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return structuredClone(defaultOccupancy);
    }

    return defaultOccupancy.map((item) => {
      const saved = parsed.find((entry) => entry?.id === item.id) || {};
      return {
        ...item,
        status: saved.status || item.status,
        period: saved.period || item.period,
        summary: saved.summary || item.summary,
        note: saved.note || item.note
      };
    });
  } catch {
    return structuredClone(defaultOccupancy);
  }
}

function saveOccupancy() {
  window.localStorage.setItem(OCCUPANCY_STORAGE_KEY, JSON.stringify(occupancyState));
}

function renderOccupancyCards() {
  if (!occupancyPublic) return;

  occupancyPublic.innerHTML = occupancyState
    .map((room) => {
      const status = getStatusMeta(room.status);
      return `
        <article class="occupancy-card">
          <div class="occupancy-card-top">
            <div>
              <h3>${escapeHtml(room.title)}</h3>
              <p>${escapeHtml(room.summary)}</p>
            </div>
            <span class="status-badge ${status.className}">${status.label}</span>
          </div>
          <div class="occupancy-meta">
            <div class="occupancy-meta-row">
              <span class="occupancy-label">Статус</span>
              <span class="occupancy-value">${status.label}</span>
            </div>
            <div class="occupancy-meta-row">
              <span class="occupancy-label">Период</span>
              <span class="occupancy-value">${escapeHtml(room.period)}</span>
            </div>
          </div>
          <p class="occupancy-note">${escapeHtml(room.note)}</p>
        </article>
      `;
    })
    .join("");
}

function renderAdminEditor() {
  if (!adminEditor) return;

  adminEditor.innerHTML = occupancyState
    .map(
      (room) => `
        <section class="admin-room">
          <h4>${escapeHtml(room.title)}</h4>
          <div class="field">
            <span>Статус</span>
            <select name="status-${room.id}">
              <option value="free"${room.status === "free" ? " selected" : ""}>Свободен</option>
              <option value="busy"${room.status === "busy" ? " selected" : ""}>Занят</option>
              <option value="hold"${room.status === "hold" ? " selected" : ""}>На подтверждении</option>
            </select>
          </div>
          <div class="field">
            <span>Короткое описание</span>
            <input type="text" name="summary-${room.id}" value="${escapeHtml(room.summary)}" />
          </div>
          <div class="field">
            <span>Период или дата</span>
            <input type="text" name="period-${room.id}" value="${escapeHtml(room.period)}" />
          </div>
          <div class="field">
            <span>Примечание</span>
            <textarea name="note-${room.id}">${escapeHtml(room.note)}</textarea>
          </div>
        </section>
      `
    )
    .join("");
}

function setMessage(target, text, tone = "") {
  if (!target) return;
  target.textContent = text;
  target.classList.remove("is-error", "is-success");
  if (tone) {
    target.classList.add(tone);
  }
}

function isAdminLoggedIn() {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function updateAdminVisibility() {
  const loggedIn = isAdminLoggedIn();
  adminPanel?.classList.toggle("is-hidden", !loggedIn);
  if (loggedIn) {
    renderAdminEditor();
  }
}

function showLightboxItem(index) {
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
}

function openLightbox(trigger) {
  if (!(trigger instanceof HTMLElement) || !lightbox || !lightboxImage) return;
  const groupName = trigger.dataset.lightboxGroup || "default";
  activeLightboxGroup = Array.from(document.querySelectorAll(`[data-lightbox-group="${groupName}"]`));
  activeLightboxIndex = Math.max(activeLightboxGroup.indexOf(trigger), 0);
  showLightboxItem(activeLightboxIndex);
  lightbox.showModal();
}

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

  track?.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true }
  );

  track?.addEventListener(
    "touchmove",
    (event) => {
      touchDeltaX = event.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );

  track?.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 40) return;
    current = touchDeltaX < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length;
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

lightboxStage?.addEventListener(
  "touchstart",
  (event) => {
    lightboxTouchStartX = event.touches[0].clientX;
    lightboxTouchDeltaX = 0;
  },
  { passive: true }
);

lightboxStage?.addEventListener(
  "touchmove",
  (event) => {
    lightboxTouchDeltaX = event.touches[0].clientX - lightboxTouchStartX;
  },
  { passive: true }
);

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

adminTrigger?.addEventListener("click", () => {
  if (isAdminLoggedIn()) {
    document.getElementById("occupancy")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  adminDialog?.showModal();
});

adminDialogClose?.addEventListener("click", () => {
  adminDialog?.close();
});

adminDialog?.addEventListener("click", (event) => {
  if (event.target === adminDialog) {
    adminDialog.close();
  }
});

adminLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(adminLoginForm);
  const login = String(formData.get("login") || "").trim();
  const password = String(formData.get("password") || "");

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setMessage(adminMessage, "");
    setMessage(adminSaveMessage, "Вы вошли как администратор.", "is-success");
    adminLoginForm.reset();
    updateAdminVisibility();
    adminDialog?.close();
    document.getElementById("occupancy")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  setMessage(adminMessage, "Неверный логин или пароль.", "is-error");
});

adminSaveButton?.addEventListener("click", () => {
  if (!adminEditor) return;

  occupancyState = occupancyState.map((room) => {
    const status = adminEditor.querySelector(`[name="status-${room.id}"]`);
    const summary = adminEditor.querySelector(`[name="summary-${room.id}"]`);
    const period = adminEditor.querySelector(`[name="period-${room.id}"]`);
    const note = adminEditor.querySelector(`[name="note-${room.id}"]`);

    return {
      ...room,
      status: status instanceof HTMLSelectElement ? status.value : room.status,
      summary: summary instanceof HTMLInputElement ? summary.value.trim() || room.summary : room.summary,
      period: period instanceof HTMLInputElement ? period.value.trim() || room.period : room.period,
      note: note instanceof HTMLTextAreaElement ? note.value.trim() || room.note : room.note
    };
  });

  saveOccupancy();
  renderOccupancyCards();
  setMessage(adminSaveMessage, "Изменения сохранены.", "is-success");
});

adminLogoutButton?.addEventListener("click", () => {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  setMessage(adminSaveMessage, "");
  setMessage(adminMessage, "");
  updateAdminVisibility();
});

renderOccupancyCards();
updateAdminVisibility();
