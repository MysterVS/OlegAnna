const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const lightboxPrev = document.querySelector("[data-lightbox-prev]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxStage = document.querySelector(".lightbox-stage");

const adminTrigger = document.querySelector("[data-admin-trigger]");
const adminDialog = document.querySelector("[data-admin-dialog]");
const adminDialogClose = document.querySelector("[data-admin-dialog-close]");
const adminLoginForm = document.querySelector("[data-admin-login-form]");
const adminMessage = document.querySelector("[data-admin-message]");
const adminPanel = document.querySelector("[data-admin-panel]");
const adminEditor = document.querySelector("[data-admin-editor]");
const adminSaveButton = document.querySelector("[data-admin-save]");
const adminSaveMessage = document.querySelector("[data-admin-save-message]");
const adminLogoutButton = document.querySelector("[data-admin-logout]");

const roomList = document.querySelector("[data-room-list]");
const occupancySummary = document.querySelector("[data-occupancy-summary]");
const filterType = document.querySelector("[data-filter-type]");
const filterFloor = document.querySelector("[data-filter-floor]");
const filterRoom = document.querySelector("[data-filter-room]");
const filterStart = document.querySelector("[data-filter-start]");
const filterEnd = document.querySelector("[data-filter-end]");
const filterReset = document.querySelector("[data-filter-reset]");
const roomCheckButtons = document.querySelectorAll("[data-room-check]");

const calendarDialog = document.querySelector("[data-calendar-dialog]");
const calendarClose = document.querySelector("[data-calendar-close]");
const calendarTitle = document.querySelector("[data-calendar-title]");
const calendarSubtitle = document.querySelector("[data-calendar-subtitle]");
const calendarMonths = document.querySelector("[data-calendar-months]");

const ADMIN_LOGIN = "theblady";
const ADMIN_PASSWORD = "13user13";
const OCCUPANCY_STORAGE_KEY = "oleganna-room-occupancy-v2";
const ADMIN_SESSION_KEY = "oleganna-admin-session";

const roomDefinitions = [
  { id: "L11", code: "Л11", category: "standard", categoryLabel: "Стандарт", floor: "1", floorLabel: "1 этаж" },
  { id: "L12", code: "Л12", category: "standard", categoryLabel: "Стандарт", floor: "1", floorLabel: "1 этаж" },
  { id: "L21", code: "Л21", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L22", code: "Л22", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L23", code: "Л23", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L24", code: "Л24", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L25", code: "Л25", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L26", code: "Л26", category: "standard", categoryLabel: "Стандарт", floor: "2", floorLabel: "2 этаж" },
  { id: "L31", code: "Л31", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "L32", code: "Л32", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "L33", code: "Л33", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "L34", code: "Л34", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "L35", code: "Л35", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "L36", code: "Л36", category: "standard", categoryLabel: "Стандарт", floor: "3", floorLabel: "3 этаж" },
  { id: "C1", code: "1-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "1", floorLabel: "1 этаж" },
  { id: "C2", code: "2-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "1", floorLabel: "1 этаж" },
  { id: "C3", code: "3-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "1", floorLabel: "1 этаж" },
  { id: "C4", code: "4-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "1", floorLabel: "1 этаж" },
  { id: "C5", code: "5-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "2", floorLabel: "2 этаж" },
  { id: "C6", code: "6-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "2", floorLabel: "2 этаж" },
  { id: "C7", code: "7-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "2", floorLabel: "2 этаж" },
  { id: "C8", code: "8-й", category: "comfort", categoryLabel: "Стандарт улучшенный", floor: "2", floorLabel: "2 этаж" },
  { id: "F1", code: "Этаж семейный", category: "family", categoryLabel: "Этаж семейный", floor: "family", floorLabel: "Семейный этаж" }
];

const roomGroups = [
  { category: "standard", categoryLabel: "Стандарт", subtitle: "14 номеров: 2 на первом этаже, 6 на втором и 6 на третьем." },
  { category: "comfort", categoryLabel: "Стандарт улучшенный", subtitle: "8 номеров: 4 на первом этаже и 4 на втором." },
  { category: "family", categoryLabel: "Этаж семейный", subtitle: "1 отдельный семейный этаж для большой компании." }
];

let activeLightboxGroup = [];
let activeLightboxIndex = 0;
let occupancyState = loadOccupancyState();
let activeCalendarRoomId = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function parseIsoDate(value) {
  return new Date(`${value}T00:00:00`);
}

function formatDate(value) {
  const date = parseIsoDate(value);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long"
  }).format(date);
}

function addDays(iso, amount) {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + amount);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function monthLabel(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function createDefaultState() {
  return roomDefinitions.map((room) => ({
    id: room.id,
    note: "",
    bookings: []
  }));
}

function normalizeBooking(booking) {
  if (!booking || !booking.start || !booking.end) return null;
  return {
    id: booking.id || `${booking.start}-${booking.end}-${Math.random().toString(36).slice(2, 8)}`,
    start: booking.start,
    end: booking.end,
    label: booking.label || "Бронь"
  };
}

function loadOccupancyState() {
  const raw = window.localStorage.getItem(OCCUPANCY_STORAGE_KEY);
  const defaults = createDefaultState();
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaults;
    return defaults.map((entry) => {
      const saved = parsed.find((item) => item?.id === entry.id);
      return {
        ...entry,
        note: typeof saved?.note === "string" ? saved.note : "",
        bookings: Array.isArray(saved?.bookings) ? saved.bookings.map(normalizeBooking).filter(Boolean) : []
      };
    });
  } catch {
    return defaults;
  }
}

function saveOccupancyState() {
  window.localStorage.setItem(OCCUPANCY_STORAGE_KEY, JSON.stringify(occupancyState));
}

function getRoomRecord(roomId) {
  return occupancyState.find((room) => room.id === roomId);
}

function getRoomDefinition(roomId) {
  return roomDefinitions.find((room) => room.id === roomId);
}

function getBookingsForRoom(roomId) {
  return getRoomRecord(roomId)?.bookings || [];
}

function isDateBusy(roomId, isoDate) {
  return getBookingsForRoom(roomId).some((booking) => booking.start <= isoDate && booking.end >= isoDate);
}

function getCurrentStatus(roomId, isoDate) {
  return isDateBusy(roomId, isoDate)
    ? { label: "Занят", className: "status-busy" }
    : { label: "Свободен", className: "status-free" };
}

function getStatusText(roomId, isoDate) {
  const bookings = getBookingsForRoom(roomId).sort((a, b) => a.start.localeCompare(b.start));
  const currentBooking = bookings.find((booking) => booking.start <= isoDate && booking.end >= isoDate);

  if (currentBooking) {
    return `Занят до ${formatDate(currentBooking.end)}`;
  }

  const nextBooking = bookings.find((booking) => booking.start > isoDate);
  if (nextBooking) {
    return `Свободен до ${formatDate(addDays(nextBooking.start, -1))}`;
  }

  return "Свободен на выбранную дату";
}

function getRoomNote(roomId) {
  return getRoomRecord(roomId)?.note || "";
}

function isAdminLoggedIn() {
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setMessage(target, text, tone = "") {
  if (!target) return;
  target.textContent = text;
  target.classList.remove("is-error", "is-success");
  if (tone) target.classList.add(tone);
}

function getFilterRange() {
  const start = filterStart?.value || todayIso();
  const endRaw = filterEnd?.value || start;
  const end = endRaw < start ? start : endRaw;
  return { start, end };
}

function getFilteredRooms() {
  const selectedType = filterType?.value || "all";
  const selectedFloor = filterFloor?.value || "all";
  const selectedRoom = filterRoom?.value || "all";

  return roomDefinitions.filter((room) => {
    if (selectedType !== "all" && room.category !== selectedType) return false;
    if (selectedFloor !== "all" && room.floor !== selectedFloor) return false;
    if (selectedRoom !== "all" && room.id !== selectedRoom) return false;
    return true;
  });
}

function isRangeBusy(roomId, startIso, endIso) {
  return getBookingsForRoom(roomId).some((booking) => booking.start <= endIso && booking.end >= startIso);
}

function getRangeStatus(roomId, startIso, endIso) {
  return isRangeBusy(roomId, startIso, endIso)
    ? { label: "Занят", className: "status-busy" }
    : { label: "Свободен", className: "status-free" };
}

function getRangeStatusText(roomId, startIso, endIso) {
  const bookings = getBookingsForRoom(roomId).sort((a, b) => a.start.localeCompare(b.start));
  const overlapping = bookings.find((booking) => booking.start <= endIso && booking.end >= startIso);

  if (overlapping) {
    return `Занят: ${formatDate(overlapping.start)} — ${formatDate(overlapping.end)}`;
  }

  return `Свободен на период ${formatDate(startIso)} — ${formatDate(endIso)}`;
}

function populateFilterOptions() {
  if (!filterType || !filterFloor || !filterRoom) return;

  const previousType = filterType.value || "all";
  const previousFloor = filterFloor.value || "all";
  const previousRoom = filterRoom.value || "all";

  const types = [...new Map(roomDefinitions.map((room) => [room.category, room.categoryLabel])).entries()];
  filterType.innerHTML = ['<option value="all">Все типы</option>']
    .concat(types.map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`))
    .join("");
  filterType.value = types.some(([value]) => value === previousType) ? previousType : "all";

  const roomsForFloor = roomDefinitions.filter((room) => filterType.value === "all" || room.category === filterType.value);
  const floors = [...new Map(roomsForFloor.map((room) => [room.floor, room.floorLabel])).entries()];
  filterFloor.innerHTML = ['<option value="all">Все этажи</option>']
    .concat(floors.map(([value, label]) => `<option value="${value}">${escapeHtml(label)}</option>`))
    .join("");
  filterFloor.value = floors.some(([value]) => value === previousFloor) ? previousFloor : "all";

  const roomsForSelect = roomDefinitions.filter((room) => {
    if (filterType.value !== "all" && room.category !== filterType.value) return false;
    if (filterFloor.value !== "all" && room.floor !== filterFloor.value) return false;
    return true;
  });

  filterRoom.innerHTML = ['<option value="all">Все номера</option>']
    .concat(
      roomsForSelect.map(
        (room) => `<option value="${room.id}">${escapeHtml(`${room.code} • ${room.categoryLabel} • ${room.floorLabel}`)}</option>`
      )
    )
    .join("");
  filterRoom.value = roomsForSelect.some((room) => room.id === previousRoom) ? previousRoom : "all";
}

function renderRoomList() {
  if (!roomList) return;
  const { start, end } = getFilterRange();
  const rooms = getFilteredRooms();
  const busyCount = rooms.filter((room) => isRangeBusy(room.id, start, end)).length;
  const freeCount = rooms.length - busyCount;

  roomList.innerHTML = rooms
    .map((room) => {
      const status = getRangeStatus(room.id, start, end);
      const note = getRoomNote(room.id);
      return `
        <article class="occupancy-card">
          <div class="occupancy-card-top">
            <div>
              <div class="occupancy-type">${escapeHtml(room.categoryLabel)} • ${escapeHtml(room.floorLabel)}</div>
              <h3>${escapeHtml(room.code)}</h3>
              <p>${escapeHtml(getRangeStatusText(room.id, start, end))}</p>
            </div>
            <span class="status-badge ${status.className}">${status.label}</span>
          </div>
          <div class="occupancy-meta">
            <div class="occupancy-meta-row">
              <span class="occupancy-label">Период</span>
              <span class="occupancy-value">${escapeHtml(formatDate(start))} — ${escapeHtml(formatDate(end))}</span>
            </div>
            <div class="occupancy-meta-row">
              <span class="occupancy-label">Ближайший статус</span>
              <span class="occupancy-value">${escapeHtml(getRangeStatusText(room.id, start, end))}</span>
            </div>
          </div>
          <p class="occupancy-note">${escapeHtml(note || "Примечание для гостей пока не добавлено.")}</p>
          <div class="occupancy-card-actions">
            <button class="button button-secondary" type="button" data-calendar-open="${room.id}">Календарь</button>
          </div>
        </article>
      `;
    })
    .join("");

  if (occupancySummary) {
    occupancySummary.textContent =
      rooms.length > 0
        ? `На период ${formatDate(start)} — ${formatDate(end)}: свободно ${freeCount}, занято ${busyCount}. Показано номеров: ${rooms.length}.`
        : "По выбранным фильтрам номера не найдены.";
  }
}

function renderAdminEditor() {
  if (!adminEditor) return;

  adminEditor.innerHTML = roomGroups
    .map((group) => {
      const rooms = roomDefinitions.filter((room) => room.category === group.category);
      return `
        <section class="admin-group">
          <div>
            <h4 class="admin-group-title">${escapeHtml(group.categoryLabel)}</h4>
            <p class="admin-group-subtitle">${escapeHtml(group.subtitle)}</p>
          </div>
          <div class="admin-room-grid">
            ${rooms
              .map((room) => {
                const record = getRoomRecord(room.id);
                const status = getCurrentStatus(room.id, todayIso());
                const bookings = [...(record?.bookings || [])].sort((a, b) => a.start.localeCompare(b.start));
                return `
                  <article class="admin-room" data-room-admin="${room.id}">
                    <div class="admin-room-head">
                      <div>
                        <h4>${escapeHtml(room.code)} • ${escapeHtml(room.floorLabel)}</h4>
                        <p>${escapeHtml(room.categoryLabel)}</p>
                      </div>
                      <span class="status-badge ${status.className}">${status.label}</span>
                    </div>

                    <div class="admin-room-fields">
                      <label class="field field-full">
                        <span>Примечание для гостей</span>
                        <textarea data-room-note="${room.id}">${escapeHtml(record?.note || "")}</textarea>
                      </label>
                    </div>

                    <div class="admin-booking-form" data-booking-form="${room.id}">
                      <label class="field">
                        <span>Заезд</span>
                        <input type="date" data-booking-start="${room.id}" />
                      </label>
                      <label class="field">
                        <span>Выезд</span>
                        <input type="date" data-booking-end="${room.id}" />
                      </label>
                      <label class="field field-full">
                        <span>Подпись</span>
                        <input type="text" data-booking-label="${room.id}" placeholder="Например: бронь, предоплата, гость" />
                      </label>
                      <button class="button button-primary" type="button" data-booking-add="${room.id}">Добавить</button>
                    </div>

                    <div class="booking-list">
                      ${
                        bookings.length > 0
                          ? bookings
                              .map(
                                (booking) => `
                                  <div class="booking-item">
                                    <div>
                                      <strong>${escapeHtml(booking.label)}</strong>
                                      <p>${escapeHtml(formatDate(booking.start))} — ${escapeHtml(formatDate(booking.end))}</p>
                                    </div>
                                    <button class="icon-button" type="button" data-booking-remove="${room.id}" data-booking-id="${booking.id}" aria-label="Удалить бронь">×</button>
                                  </div>
                                `
                              )
                              .join("")
                          : '<p class="booking-empty">Занятых периодов пока нет.</p>'
                      }
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function saveAdminFields() {
  roomDefinitions.forEach((room) => {
    const noteField = adminEditor?.querySelector(`[data-room-note="${room.id}"]`);
    const record = getRoomRecord(room.id);
    if (record && noteField instanceof HTMLTextAreaElement) {
      record.note = noteField.value.trim();
    }
  });
  saveOccupancyState();
}

function openCalendar(roomId) {
  if (!calendarDialog || !calendarMonths) return;
  const room = getRoomDefinition(roomId);
  if (!room) return;

  activeCalendarRoomId = roomId;
  const startDate = parseIsoDate(getFilterRange().start);
  const firstMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const secondMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);

  if (calendarTitle) {
    calendarTitle.textContent = `${room.code} • ${room.categoryLabel}`;
  }
  if (calendarSubtitle) {
    calendarSubtitle.textContent = `${room.floorLabel} — свободные и занятые даты`;
  }

  calendarMonths.innerHTML = [firstMonth, secondMonth].map((date) => renderCalendarMonth(roomId, date)).join("");
  if (!calendarDialog.open) {
    calendarDialog.showModal();
  }
}

function renderCalendarMonth(roomId, monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const offset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const cells = [];
  const today = todayIso();

  for (let i = 0; i < offset; i += 1) {
    cells.push('<span class="calendar-day empty"></span>');
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const monthValue = String(month + 1).padStart(2, "0");
    const dayValue = String(day).padStart(2, "0");
    const iso = `${year}-${monthValue}-${dayValue}`;
    const stateClass = isDateBusy(roomId, iso) ? "busy" : "free";
    const todayClass = iso === today ? " today" : "";
    cells.push(`<span class="calendar-day ${stateClass}${todayClass}">${day}</span>`);
  }

  return `
    <section class="calendar-month">
      <h4>${escapeHtml(monthLabel(monthDate))}</h4>
      <div class="calendar-weekdays">
        <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      </div>
      <div class="calendar-grid">${cells.join("")}</div>
    </section>
  `;
}

function updateAdminVisibility() {
  const loggedIn = isAdminLoggedIn();
  adminPanel?.classList.toggle("is-hidden", !loggedIn);
  adminTrigger?.classList.toggle("is-active", loggedIn);
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
    if (calendarDialog?.open) calendarDialog.close();
    if (adminDialog?.open) adminDialog.close();
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

adminEditor?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const addButton = target.closest("[data-booking-add]");
  if (addButton instanceof HTMLElement) {
    const roomId = addButton.dataset.bookingAdd;
    if (!roomId) return;

    const startField = adminEditor.querySelector(`[data-booking-start="${roomId}"]`);
    const endField = adminEditor.querySelector(`[data-booking-end="${roomId}"]`);
    const labelField = adminEditor.querySelector(`[data-booking-label="${roomId}"]`);

    if (!(startField instanceof HTMLInputElement) || !(endField instanceof HTMLInputElement) || !(labelField instanceof HTMLInputElement)) {
      return;
    }

    const start = startField.value;
    const end = endField.value;
    const label = labelField.value.trim() || "Бронь";

    if (!start || !end) {
      setMessage(adminSaveMessage, "Укажите дату заезда и выезда.", "is-error");
      return;
    }

    if (start > end) {
      setMessage(adminSaveMessage, "Дата выезда не может быть раньше даты заезда.", "is-error");
      return;
    }

    const record = getRoomRecord(roomId);
    if (!record) return;

    record.bookings.push({
      id: `${roomId}-${Date.now()}`,
      start,
      end,
      label
    });
    record.bookings.sort((a, b) => a.start.localeCompare(b.start));
    renderAdminEditor();
    renderRoomList();
    setMessage(adminSaveMessage, "Период добавлен. Не забудьте нажать «Сохранить».", "is-success");
    return;
  }

  const removeButton = target.closest("[data-booking-remove]");
  if (removeButton instanceof HTMLElement) {
    const roomId = removeButton.dataset.bookingRemove;
    const bookingId = removeButton.dataset.bookingId;
    if (!roomId || !bookingId) return;

    const record = getRoomRecord(roomId);
    if (!record) return;
    record.bookings = record.bookings.filter((booking) => booking.id !== bookingId);
    renderAdminEditor();
    renderRoomList();
    setMessage(adminSaveMessage, "Период удалён. Не забудьте нажать «Сохранить».", "is-success");
  }
});

adminSaveButton?.addEventListener("click", () => {
  saveAdminFields();
  saveOccupancyState();
  renderRoomList();
  if (activeCalendarRoomId) {
    openCalendar(activeCalendarRoomId);
  }
  setMessage(adminSaveMessage, "Изменения сохранены.", "is-success");
});

adminLogoutButton?.addEventListener("click", () => {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  setMessage(adminSaveMessage, "");
  setMessage(adminMessage, "");
  updateAdminVisibility();
});

roomList?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("[data-calendar-open]");
  if (!(button instanceof HTMLElement)) return;
  const roomId = button.dataset.calendarOpen;
  if (!roomId) return;
  openCalendar(roomId);
});

roomCheckButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-room-check");
    if (!category) return;
    if (filterType) filterType.value = category;
    populateFilterOptions();
    if (filterRoom) filterRoom.value = "all";
    renderRoomList();
    document.getElementById("occupancy")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

calendarClose?.addEventListener("click", () => {
  calendarDialog?.close();
});

calendarDialog?.addEventListener("click", (event) => {
  if (event.target === calendarDialog) {
    calendarDialog.close();
  }
});

[filterType, filterFloor].forEach((control) => {
  control?.addEventListener("change", () => {
    populateFilterOptions();
    renderRoomList();
  });
});

filterRoom?.addEventListener("change", renderRoomList);
filterStart?.addEventListener("change", () => {
  if (filterEnd && filterEnd.value && filterEnd.value < (filterStart?.value || todayIso())) {
    filterEnd.value = filterStart?.value || todayIso();
  }
  renderRoomList();
});
filterEnd?.addEventListener("change", () => {
  if (filterStart && filterEnd && filterEnd.value < filterStart.value) {
    filterEnd.value = filterStart.value;
  }
  renderRoomList();
});

filterReset?.addEventListener("click", () => {
  if (filterType) filterType.value = "all";
  populateFilterOptions();
  if (filterRoom) filterRoom.value = "all";
  if (filterStart) filterStart.value = todayIso();
  if (filterEnd) filterEnd.value = addDays(todayIso(), 6);
  renderRoomList();
});

if (filterStart) {
  filterStart.value = todayIso();
}

if (filterEnd) {
  filterEnd.value = addDays(todayIso(), 6);
}

populateFilterOptions();
renderRoomList();
updateAdminVisibility();
