const STORAGE_KEY = "bellibox_state_v1";

const RESTAURANTS = [
  {
    id: 1,
    name: "Nori Basement",
    cuisine: "Japanese",
    city: "Los Angeles",
    neighborhood: "Sawtelle",
    price: 3,
    popularity: 99,
    tags: ["omakase", "late night", "counter seats"],
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 2,
    name: "Harvest Union",
    cuisine: "Californian",
    city: "San Diego",
    neighborhood: "Little Italy",
    price: 3,
    popularity: 92,
    tags: ["farm to table", "date night", "wine list"],
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 3,
    name: "Peach Street Noodles",
    cuisine: "Chinese",
    city: "San Francisco",
    neighborhood: "Outer Sunset",
    price: 2,
    popularity: 87,
    tags: ["hand pulled", "comfort food", "cash only"],
    image:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 4,
    name: "Riviera Smokehouse",
    cuisine: "BBQ",
    city: "Austin",
    neighborhood: "East Cesar Chavez",
    price: 2,
    popularity: 95,
    tags: ["brisket", "weekend line", "group spot"],
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 5,
    name: "Mina's Corner",
    cuisine: "Korean",
    city: "New York",
    neighborhood: "Koreatown",
    price: 2,
    popularity: 91,
    tags: ["kbbq", "fast service", "shared plates"],
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    name: "Saffron Dock",
    cuisine: "Indian",
    city: "Chicago",
    neighborhood: "River North",
    price: 3,
    popularity: 84,
    tags: ["tasting menu", "cocktails", "spicy"],
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 7,
    name: "Neon Arepa Lab",
    cuisine: "Venezuelan",
    city: "Miami",
    neighborhood: "Wynwood",
    price: 1,
    popularity: 88,
    tags: ["street food", "creative fillings", "quick bite"],
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 8,
    name: "Copper Bird",
    cuisine: "Mediterranean",
    city: "Seattle",
    neighborhood: "Capitol Hill",
    price: 3,
    popularity: 83,
    tags: ["mezze", "vegetarian friendly", "patio"],
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 9,
    name: "Southline Pizza Club",
    cuisine: "Italian",
    city: "Los Angeles",
    neighborhood: "Silver Lake",
    price: 2,
    popularity: 90,
    tags: ["wood fired", "natural wine", "friends night"],
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 10,
    name: "Borrowed Table",
    cuisine: "French",
    city: "Portland",
    neighborhood: "Pearl District",
    price: 4,
    popularity: 79,
    tags: ["chef tasting", "special occasion", "reservations"],
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 11,
    name: "Koko and Thyme",
    cuisine: "Thai",
    city: "Boston",
    neighborhood: "Back Bay",
    price: 2,
    popularity: 86,
    tags: ["noodles", "weekday lunch", "rainy day"],
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 12,
    name: "Sierra Verde Cafe",
    cuisine: "Mexican",
    city: "Denver",
    neighborhood: "Highland",
    price: 2,
    popularity: 81,
    tags: ["brunch", "house salsa", "family style"],
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80"
  }
];

const FRIEND_PROFILES = [
  { id: "f-1", name: "Maya", handle: "@mayaeats" },
  { id: "f-2", name: "Kevin", handle: "@tablehops" },
  { id: "f-3", name: "Dana", handle: "@midnightmenus" }
];

const SEED_FRIEND_EVENTS = [
  {
    id: "fe-1",
    friendId: "f-1",
    type: "log",
    restaurantId: 4,
    rating: 4.5,
    note: "Brisket sold out by 2pm. Worth arriving early.",
    date: "2026-02-21"
  },
  {
    id: "fe-2",
    friendId: "f-2",
    type: "watch",
    restaurantId: 10,
    date: "2026-02-20"
  },
  {
    id: "fe-3",
    friendId: "f-3",
    type: "log",
    restaurantId: 1,
    rating: 5,
    note: "Exact rice temp and an unreal scallop hand roll.",
    date: "2026-02-19"
  },
  {
    id: "fe-4",
    friendId: "f-1",
    type: "log",
    restaurantId: 8,
    rating: 4,
    note: "Great mezze board and an easy weeknight patio.",
    date: "2026-02-18"
  }
];

function seedState() {
  return {
    profile: {
      name: "Henry",
      handle: "@hungryhenry",
      bio: "Always tracking first bites and comeback spots."
    },
    watchlist: [1, 6, 10, 12],
    logs: [
      {
        id: "log-1",
        restaurantId: 2,
        rating: 4.5,
        date: "2026-02-21",
        note: "Roasted carrots starter and grilled trout were both excellent."
      },
      {
        id: "log-2",
        restaurantId: 9,
        rating: 4,
        date: "2026-02-19",
        note: "Crunchy edge, airy center. Truffle pie was better than expected."
      },
      {
        id: "log-3",
        restaurantId: 5,
        rating: 4.5,
        date: "2026-02-17",
        note: "Late table but service was fast once seated."
      },
      {
        id: "log-4",
        restaurantId: 3,
        rating: 3.5,
        date: "2026-02-10",
        note: "Noodle texture was perfect, broth was slightly salty."
      }
    ],
    customLists: [
      {
        id: "list-1",
        title: "Date Night Rotation",
        description: "Reliable picks for low-noise dinner nights.",
        itemIds: [2, 8, 10]
      },
      {
        id: "list-2",
        title: "Fast Lunch Under $20",
        description: "Weekday quick hitters.",
        itemIds: [3, 7, 12]
      }
    ],
    friendProfiles: FRIEND_PROFILES.slice(),
    friendEvents: SEED_FRIEND_EVENTS.slice()
  };
}

const els = {
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  views: Array.from(document.querySelectorAll(".view")),
  headerStats: document.getElementById("headerStats"),
  resetSeedBtn: document.getElementById("resetSeedBtn"),
  searchInput: document.getElementById("searchInput"),
  cuisineFilter: document.getElementById("cuisineFilter"),
  cityFilter: document.getElementById("cityFilter"),
  sortFilter: document.getElementById("sortFilter"),
  logForm: document.getElementById("logForm"),
  logRestaurant: document.getElementById("logRestaurant"),
  logRating: document.getElementById("logRating"),
  logDate: document.getElementById("logDate"),
  logNote: document.getElementById("logNote"),
  removeWatchlist: document.getElementById("removeWatchlist"),
  restaurantGrid: document.getElementById("restaurantGrid"),
  createListForm: document.getElementById("createListForm"),
  listNameInput: document.getElementById("listNameInput"),
  listDescInput: document.getElementById("listDescInput"),
  watchlistGrid: document.getElementById("watchlistGrid"),
  customLists: document.getElementById("customLists"),
  monthFilter: document.getElementById("monthFilter"),
  diaryTimeline: document.getElementById("diaryTimeline"),
  feedList: document.getElementById("feedList"),
  profileForm: document.getElementById("profileForm"),
  profileName: document.getElementById("profileName"),
  profileHandle: document.getElementById("profileHandle"),
  profileBio: document.getElementById("profileBio"),
  profileStats: document.getElementById("profileStats"),
  topRatedList: document.getElementById("topRatedList"),
  toast: document.getElementById("toast")
};

let state = loadState();
let toastTimer = null;

init();

function init() {
  hydrateFilters();
  hydrateRestaurantOptions();
  bindEvents();
  els.logDate.value = todayIso();
  renderAll();
}

function bindEvents() {
  els.navButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  els.searchInput.addEventListener("input", renderDiscovery);
  els.cuisineFilter.addEventListener("change", renderDiscovery);
  els.cityFilter.addEventListener("change", renderDiscovery);
  els.sortFilter.addEventListener("change", renderDiscovery);

  els.logForm.addEventListener("submit", handleLogSubmit);
  els.restaurantGrid.addEventListener("click", handleRestaurantGridClick);
  els.watchlistGrid.addEventListener("click", handleWatchlistClick);
  els.createListForm.addEventListener("submit", handleCreateListSubmit);
  els.customLists.addEventListener("click", handleCustomListClick);
  els.monthFilter.addEventListener("change", renderDiary);
  els.profileForm.addEventListener("submit", handleProfileSubmit);
  els.resetSeedBtn.addEventListener("click", handleResetData);
}

function hydrateFilters() {
  const cuisines = Array.from(new Set(RESTAURANTS.map((item) => item.cuisine))).sort();
  const cities = Array.from(new Set(RESTAURANTS.map((item) => item.city))).sort();

  els.cuisineFilter.insertAdjacentHTML(
    "beforeend",
    cuisines.map((cuisine) => `<option value="${cuisine}">${cuisine}</option>`).join("")
  );

  els.cityFilter.insertAdjacentHTML(
    "beforeend",
    cities.map((city) => `<option value="${city}">${city}</option>`).join("")
  );
}

function hydrateRestaurantOptions() {
  const options = RESTAURANTS.map(
    (restaurant) =>
      `<option value="${restaurant.id}">${escapeHtml(restaurant.name)} - ${escapeHtml(restaurant.city)}</option>`
  ).join("");

  els.logRestaurant.innerHTML = options;
}

function renderAll() {
  syncMonthFilter();
  renderHeaderStats();
  renderDiscovery();
  renderWatchlist();
  renderCustomLists();
  renderDiary();
  renderFeed();
  renderProfile();
}

function setView(viewName) {
  els.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  els.views.forEach((view) => {
    view.classList.toggle("active", view.id === `view-${viewName}`);
  });
}

function renderHeaderStats() {
  const avgRating = average(state.logs.map((log) => log.rating));
  const uniqueLogged = new Set(state.logs.map((log) => log.restaurantId)).size;

  els.headerStats.innerHTML = `
    <div class="chip"><b>${state.logs.length}</b> logged</div>
    <div class="chip"><b>${formatRating(avgRating)}</b> avg score</div>
    <div class="chip"><b>${uniqueLogged}</b> places tried</div>
    <div class="chip"><b>${state.watchlist.length}</b> want to try</div>
  `;
}

function renderDiscovery() {
  const items = getFilteredRestaurants();

  if (!items.length) {
    els.restaurantGrid.innerHTML = `<div class="empty">No restaurants match this filter.</div>`;
    return;
  }

  els.restaurantGrid.innerHTML = items
    .map((restaurant, index) => {
      const isSaved = state.watchlist.includes(restaurant.id);
      const community = getCommunityMetrics(restaurant.id);
      const activityDate = getLatestActivityDate(restaurant.id);
      const dateLine = activityDate ? `Last activity ${formatDate(activityDate)}` : "No recent activity";

      return `
        <article class="restaurant-card reveal" style="--delay:${index * 0.04}s">
          <img src="${restaurant.image}" alt="${escapeHtml(restaurant.name)}" loading="lazy" />
          <h3>${escapeHtml(restaurant.name)}</h3>
          <div class="meta-row">
            <span class="meta-pill">${escapeHtml(restaurant.cuisine)}</span>
            <span class="meta-pill">${escapeHtml(restaurant.city)}</span>
            <span class="meta-pill">${priceSymbol(restaurant.price)}</span>
          </div>
          <p class="subtle">${escapeHtml(restaurant.neighborhood)} | ${dateLine}</p>
          <p class="rating">${community.count ? `${formatRating(community.avg)} avg from ${community.count} logs` : "No ratings yet"}</p>
          <div class="meta-row">
            ${restaurant.tags.map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="button-row">
            <button class="btn small ghost" data-action="toggle-watch" data-id="${restaurant.id}">
              ${isSaved ? "Remove Want to Try" : "Want to Try"}
            </button>
            <button class="btn small solid" data-action="prefill-log" data-id="${restaurant.id}">
              Log Visit
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderWatchlist() {
  const items = state.watchlist
    .map((id) => getRestaurant(id))
    .filter(Boolean);

  if (!items.length) {
    els.watchlistGrid.innerHTML = `<div class="empty">Your Want to Try list is empty.</div>`;
    return;
  }

  els.watchlistGrid.innerHTML = items
    .map(
      (restaurant, index) => `
        <article class="watch-item reveal" style="--delay:${index * 0.03}s">
          <header>
            <h3>${escapeHtml(restaurant.name)}</h3>
            <span class="meta-pill">${priceSymbol(restaurant.price)}</span>
          </header>
          <p class="subtle">${escapeHtml(restaurant.city)} | ${escapeHtml(restaurant.cuisine)}</p>
          <div class="button-row">
            <button class="btn small ghost" data-action="remove-watch" data-id="${restaurant.id}">Remove</button>
            <button class="btn small solid" data-action="prefill-log" data-id="${restaurant.id}">Log Visit</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCustomLists() {
  if (!state.customLists.length) {
    els.customLists.innerHTML = `<div class="empty">No custom lists yet. Create your first list above.</div>`;
    return;
  }

  els.customLists.innerHTML = state.customLists
    .map((list, index) => {
      const itemNames = list.itemIds
        .map((id) => getRestaurant(id))
        .filter(Boolean);

      const options = RESTAURANTS.filter((item) => !list.itemIds.includes(item.id))
        .map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`)
        .join("");

      const itemsHtml = itemNames.length
        ? `<ul class="flat-list">
            ${itemNames
              .map(
                (restaurant) => `
                <li>
                  <span>${escapeHtml(restaurant.name)}</span>
                  <button class="btn small ghost" data-action="remove-list-item" data-list-id="${list.id}" data-id="${restaurant.id}">Remove</button>
                </li>
              `
              )
              .join("")}
          </ul>`
        : `<div class="empty">No restaurants added yet.</div>`;

      return `
        <article class="list-card reveal" style="--delay:${index * 0.03}s">
          <header>
            <h3>${escapeHtml(list.title)}</h3>
            <button class="btn small ghost" data-action="delete-list" data-list-id="${list.id}">Delete</button>
          </header>
          <p class="subtle">${escapeHtml(list.description || "No description")}</p>
          ${itemsHtml}
          <div class="inline-form">
            <select data-list-select="${list.id}">
              <option value="">Add a restaurant</option>
              ${options}
            </select>
            <button class="btn small solid" data-action="add-list-item" data-list-id="${list.id}">Add</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function syncMonthFilter() {
  const months = Array.from(new Set(state.logs.map((log) => log.date.slice(0, 7))))
    .sort((a, b) => dateToTs(`${b}-01`) - dateToTs(`${a}-01`));

  const previous = els.monthFilter.value || "all";
  els.monthFilter.innerHTML = `
    <option value="all">All months</option>
    ${months.map((month) => `<option value="${month}">${monthLabel(month)}</option>`).join("")}
  `;

  els.monthFilter.value = months.includes(previous) ? previous : "all";
}

function renderDiary() {
  const month = els.monthFilter.value;
  const entries = state.logs
    .slice()
    .sort((a, b) => dateToTs(b.date) - dateToTs(a.date))
    .filter((entry) => month === "all" || entry.date.startsWith(month));

  if (!entries.length) {
    els.diaryTimeline.innerHTML = `<div class="empty">No diary entries for this month.</div>`;
    return;
  }

  els.diaryTimeline.innerHTML = entries
    .map((entry, index) => {
      const restaurant = getRestaurant(entry.restaurantId);
      if (!restaurant) {
        return "";
      }

      return `
        <article class="diary-item reveal" style="--delay:${index * 0.03}s">
          <header>
            <h3>${escapeHtml(restaurant.name)}</h3>
            <span class="meta-pill">${formatDate(entry.date)}</span>
          </header>
          <p class="rating">${formatRating(entry.rating)} / 5</p>
          <p class="subtle">${escapeHtml(restaurant.city)} | ${escapeHtml(restaurant.cuisine)}</p>
          <p>${escapeHtml(entry.note || "No written notes for this entry.")}</p>
        </article>
      `;
    })
    .join("");
}

function renderFeed() {
  const userEvents = state.logs.map((log) => ({
    id: `u-${log.id}`,
    actor: `${state.profile.name} ${state.profile.handle}`,
    date: log.date,
    text: `logged ${getRestaurant(log.restaurantId)?.name || "a restaurant"} with ${formatRating(log.rating)}/5`,
    note: log.note
  }));

  const friendEvents = state.friendEvents.map((event) => {
    const friend = state.friendProfiles.find((item) => item.id === event.friendId);
    const restaurant = getRestaurant(event.restaurantId);
    const actor = friend ? `${friend.name} ${friend.handle}` : "Friend";

    if (event.type === "watch") {
      return {
        id: event.id,
        actor,
        date: event.date,
        text: `added ${restaurant ? restaurant.name : "a restaurant"} to Want to Try`,
        note: ""
      };
    }

    return {
      id: event.id,
      actor,
      date: event.date,
      text: `logged ${restaurant ? restaurant.name : "a restaurant"} with ${formatRating(event.rating)}/5`,
      note: event.note || ""
    };
  });

  const timeline = userEvents
    .concat(friendEvents)
    .sort((a, b) => dateToTs(b.date) - dateToTs(a.date));

  els.feedList.innerHTML = timeline
    .map(
      (event, index) => `
        <article class="feed-item reveal" style="--delay:${index * 0.02}s">
          <header>
            <h3>${escapeHtml(event.actor)}</h3>
            <span class="meta-pill">${formatDate(event.date)}</span>
          </header>
          <p>${escapeHtml(event.text)}</p>
          ${event.note ? `<p class="subtle">"${escapeHtml(event.note)}"</p>` : ""}
        </article>
      `
    )
    .join("");
}

function renderProfile() {
  els.profileName.value = state.profile.name;
  els.profileHandle.value = state.profile.handle;
  els.profileBio.value = state.profile.bio;

  const averageRating = average(state.logs.map((log) => log.rating));
  const uniqueCities = new Set(
    state.logs.map((log) => getRestaurant(log.restaurantId)?.city).filter(Boolean)
  ).size;
  const streak = calculateStreak(state.logs);

  els.profileStats.innerHTML = `
    <h2>${escapeHtml(state.profile.name)} <span class="subtle">${escapeHtml(state.profile.handle)}</span></h2>
    <p class="subtle">${escapeHtml(state.profile.bio || "No bio yet.")}</p>
    <div class="stats-grid">
      <div class="stat-card"><div class="k">${state.logs.length}</div><div>Entries</div></div>
      <div class="stat-card"><div class="k">${formatRating(averageRating)}</div><div>Average</div></div>
      <div class="stat-card"><div class="k">${streak}</div><div>Diary streak</div></div>
      <div class="stat-card"><div class="k">${uniqueCities}</div><div>Cities explored</div></div>
      <div class="stat-card"><div class="k">${state.customLists.length + 1}</div><div>Active lists</div></div>
    </div>
    ${renderDistribution(state.logs)}
  `;

  const bestByRestaurant = new Map();
  state.logs.forEach((log) => {
    const current = bestByRestaurant.get(log.restaurantId);
    if (
      !current ||
      log.rating > current.rating ||
      (log.rating === current.rating && dateToTs(log.date) > dateToTs(current.date))
    ) {
      bestByRestaurant.set(log.restaurantId, log);
    }
  });

  const top = Array.from(bestByRestaurant.values())
    .sort((a, b) => b.rating - a.rating || dateToTs(b.date) - dateToTs(a.date))
    .slice(0, 5);

  if (!top.length) {
    els.topRatedList.innerHTML = `<div class="empty">Log visits to see your top rated places.</div>`;
    return;
  }

  els.topRatedList.innerHTML = top
    .map((entry) => {
      const restaurant = getRestaurant(entry.restaurantId);
      if (!restaurant) {
        return "";
      }

      return `
        <article class="list-card">
          <header>
            <h3>${escapeHtml(restaurant.name)}</h3>
            <span class="rating">${formatRating(entry.rating)} / 5</span>
          </header>
          <p class="subtle">${escapeHtml(restaurant.city)} | logged ${formatDate(entry.date)}</p>
        </article>
      `;
    })
    .join("");
}

function renderDistribution(logs) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  logs.forEach((entry) => {
    const bucket = Math.max(1, Math.min(5, Math.round(entry.rating)));
    counts[bucket] += 1;
  });

  const max = Math.max(1, ...Object.values(counts));
  const rows = [5, 4, 3, 2, 1]
    .map((score) => {
      const pct = (counts[score] / max) * 100;
      return `
        <div class="bar-row">
          <span>${score} star</span>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
          <span>${counts[score]}</span>
        </div>
      `;
    })
    .join("");

  return `<div class="bar-group">${rows}</div>`;
}

function handleLogSubmit(event) {
  event.preventDefault();

  const restaurantId = Number(els.logRestaurant.value);
  const rating = clampRating(Number(els.logRating.value));
  const date = els.logDate.value || todayIso();
  const note = (els.logNote.value || "").trim();

  if (!getRestaurant(restaurantId)) {
    showToast("Select a valid restaurant.");
    return;
  }

  state.logs.unshift({
    id: uid("log"),
    restaurantId,
    rating,
    date,
    note
  });

  if (els.removeWatchlist.checked) {
    state.watchlist = state.watchlist.filter((id) => id !== restaurantId);
  }

  saveState();
  renderAll();

  els.logForm.reset();
  els.logDate.value = todayIso();
  els.logRestaurant.value = String(restaurantId);
  els.logRating.value = "4";
  showToast("Visit logged.");
}

function handleRestaurantGridClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const restaurantId = Number(button.dataset.id);
  if (!getRestaurant(restaurantId)) {
    return;
  }

  if (action === "toggle-watch") {
    if (state.watchlist.includes(restaurantId)) {
      state.watchlist = state.watchlist.filter((id) => id !== restaurantId);
      showToast("Removed from Want to Try.");
    } else {
      state.watchlist.unshift(restaurantId);
      showToast("Added to Want to Try.");
    }
    saveState();
    renderAll();
    return;
  }

  if (action === "prefill-log") {
    prefillLog(restaurantId);
  }
}

function handleWatchlistClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const action = button.dataset.action;
  const restaurantId = Number(button.dataset.id);
  if (!getRestaurant(restaurantId)) {
    return;
  }

  if (action === "remove-watch") {
    state.watchlist = state.watchlist.filter((id) => id !== restaurantId);
    saveState();
    renderAll();
    showToast("Removed from Want to Try.");
    return;
  }

  if (action === "prefill-log") {
    prefillLog(restaurantId);
  }
}

function handleCreateListSubmit(event) {
  event.preventDefault();

  const title = (els.listNameInput.value || "").trim();
  const description = (els.listDescInput.value || "").trim();

  if (!title) {
    showToast("List name is required.");
    return;
  }

  state.customLists.unshift({
    id: uid("list"),
    title,
    description,
    itemIds: []
  });

  saveState();
  renderAll();
  els.createListForm.reset();
  showToast("List created.");
}

function handleCustomListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const listId = button.dataset.listId;
  const list = state.customLists.find((item) => item.id === listId);
  if (!list) {
    return;
  }

  const action = button.dataset.action;
  if (action === "delete-list") {
    state.customLists = state.customLists.filter((item) => item.id !== listId);
    saveState();
    renderAll();
    showToast("List deleted.");
    return;
  }

  if (action === "remove-list-item") {
    const restaurantId = Number(button.dataset.id);
    list.itemIds = list.itemIds.filter((id) => id !== restaurantId);
    saveState();
    renderAll();
    showToast("Removed from list.");
    return;
  }

  if (action === "add-list-item") {
    const select = els.customLists.querySelector(`select[data-list-select="${listId}"]`);
    if (!select) {
      return;
    }

    const restaurantId = Number(select.value);
    if (!restaurantId || !getRestaurant(restaurantId)) {
      showToast("Choose a restaurant to add.");
      return;
    }

    if (!list.itemIds.includes(restaurantId)) {
      list.itemIds.push(restaurantId);
      saveState();
      renderAll();
      showToast("Added to list.");
    }
  }
}

function handleProfileSubmit(event) {
  event.preventDefault();
  const name = (els.profileName.value || "").trim();
  const handleRaw = (els.profileHandle.value || "").trim().replace(/\s+/g, "");
  const handle = handleRaw ? `@${handleRaw.replace(/^@+/, "")}` : "@foodie";
  const bio = (els.profileBio.value || "").trim();

  if (!name) {
    showToast("Profile name is required.");
    return;
  }

  state.profile = { name, handle, bio };
  saveState();
  renderAll();
  showToast("Profile updated.");
}

function handleResetData() {
  const confirmed = window.confirm("Reset all Bellibox data to the seed demo state?");
  if (!confirmed) {
    return;
  }

  state = seedState();
  saveState();
  renderAll();
  setView("discovery");
  showToast("Demo data restored.");
}

function prefillLog(restaurantId) {
  setView("discovery");
  els.logRestaurant.value = String(restaurantId);
  els.logRestaurant.focus();
  showToast("Restaurant selected. Add your rating and note.");
}

function getFilteredRestaurants() {
  const search = (els.searchInput.value || "").trim().toLowerCase();
  const cuisine = els.cuisineFilter.value;
  const city = els.cityFilter.value;
  const sort = els.sortFilter.value;

  const filtered = RESTAURANTS.filter((item) => {
    const searchable = `${item.name} ${item.city} ${item.neighborhood} ${item.tags.join(" ")}`.toLowerCase();
    const matchesSearch = !search || searchable.includes(search);
    const matchesCuisine = cuisine === "all" || item.cuisine === cuisine;
    const matchesCity = city === "all" || item.city === city;
    return matchesSearch && matchesCuisine && matchesCity;
  });

  filtered.sort((a, b) => {
    if (sort === "highest") {
      return getCommunityMetrics(b.id).avg - getCommunityMetrics(a.id).avg || b.popularity - a.popularity;
    }

    if (sort === "newest") {
      return getLatestActivityTs(b.id) - getLatestActivityTs(a.id) || b.popularity - a.popularity;
    }

    if (sort === "price-low") {
      return a.price - b.price || b.popularity - a.popularity;
    }

    if (sort === "price-high") {
      return b.price - a.price || b.popularity - a.popularity;
    }

    return b.popularity - a.popularity;
  });

  return filtered;
}

function getCommunityMetrics(restaurantId) {
  const userRatings = state.logs
    .filter((log) => log.restaurantId === restaurantId)
    .map((log) => log.rating);
  const friendRatings = state.friendEvents
    .filter((event) => event.type === "log" && event.restaurantId === restaurantId)
    .map((event) => event.rating);

  const allRatings = userRatings.concat(friendRatings).filter((rating) => Number.isFinite(rating));
  const avg = allRatings.length ? average(allRatings) : 0;
  return { avg, count: allRatings.length };
}

function getLatestActivityDate(restaurantId) {
  const ts = getLatestActivityTs(restaurantId);
  if (!ts) {
    return "";
  }
  return new Date(ts).toISOString().slice(0, 10);
}

function getLatestActivityTs(restaurantId) {
  const userDates = state.logs
    .filter((log) => log.restaurantId === restaurantId)
    .map((log) => dateToTs(log.date));
  const friendDates = state.friendEvents
    .filter((event) => event.restaurantId === restaurantId)
    .map((event) => dateToTs(event.date));

  const allDates = userDates.concat(friendDates);
  return allDates.length ? Math.max(...allDates) : 0;
}

function calculateStreak(logs) {
  if (!logs.length) {
    return 0;
  }

  const days = Array.from(new Set(logs.map((entry) => entry.date))).sort(
    (a, b) => dateToTs(b) - dateToTs(a)
  );

  let streak = 1;
  for (let i = 1; i < days.length; i += 1) {
    const previous = dateToTs(days[i - 1]);
    const current = dateToTs(days[i]);
    const diff = Math.round((previous - current) / 86400000);
    if (diff !== 1) {
      break;
    }
    streak += 1;
  }
  return streak;
}

function saveState() {
  const payload = {
    profile: state.profile,
    watchlist: state.watchlist,
    logs: state.logs,
    customLists: state.customLists
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  const seeded = seedState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw);
    const logs = Array.isArray(parsed.logs)
      ? parsed.logs
          .map(normalizeLog)
          .filter(Boolean)
          .sort((a, b) => dateToTs(b.date) - dateToTs(a.date))
      : seeded.logs;
    const watchlist = Array.isArray(parsed.watchlist)
      ? parsed.watchlist
          .map(Number)
          .filter((id, idx, array) => getRestaurant(id) && array.indexOf(id) === idx)
      : seeded.watchlist;
    const customLists = Array.isArray(parsed.customLists)
      ? parsed.customLists.map(normalizeList).filter(Boolean)
      : seeded.customLists;

    return {
      profile: {
        name:
          typeof parsed.profile?.name === "string" && parsed.profile.name.trim()
            ? parsed.profile.name.trim()
            : seeded.profile.name,
        handle: sanitizeHandle(parsed.profile?.handle || seeded.profile.handle),
        bio:
          typeof parsed.profile?.bio === "string"
            ? parsed.profile.bio
            : seeded.profile.bio
      },
      watchlist,
      logs,
      customLists,
      friendProfiles: seeded.friendProfiles,
      friendEvents: seeded.friendEvents
    };
  } catch (_error) {
    return seeded;
  }
}

function normalizeLog(entry) {
  const restaurantId = Number(entry.restaurantId);
  const rating = clampRating(Number(entry.rating));
  const date =
    typeof entry.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
      ? entry.date
      : todayIso();
  const note = typeof entry.note === "string" ? entry.note.slice(0, 400) : "";

  if (!getRestaurant(restaurantId)) {
    return null;
  }

  return {
    id: typeof entry.id === "string" ? entry.id : uid("log"),
    restaurantId,
    rating,
    date,
    note
  };
}

function normalizeList(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const title = typeof entry.title === "string" ? entry.title.trim() : "";
  if (!title) {
    return null;
  }

  const itemIds = Array.isArray(entry.itemIds)
    ? entry.itemIds
        .map(Number)
        .filter((id, idx, array) => getRestaurant(id) && array.indexOf(id) === idx)
    : [];

  return {
    id: typeof entry.id === "string" ? entry.id : uid("list"),
    title: title.slice(0, 80),
    description:
      typeof entry.description === "string" ? entry.description.slice(0, 160) : "",
    itemIds
  };
}

function average(values) {
  if (!values.length) {
    return 0;
  }
  const total = values.reduce((sum, value) => sum + Number(value || 0), 0);
  return total / values.length;
}

function clampRating(value) {
  const safe = Number.isFinite(value) ? value : 4;
  const snapped = Math.round(safe * 2) / 2;
  return Math.min(5, Math.max(0.5, snapped));
}

function getRestaurant(id) {
  return RESTAURANTS.find((restaurant) => restaurant.id === Number(id));
}

function uid(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function sanitizeHandle(value) {
  const trimmed = String(value || "")
    .trim()
    .replace(/\s+/g, "");
  return trimmed ? `@${trimmed.replace(/^@+/, "")}` : "@foodie";
}

function priceSymbol(level) {
  return "$".repeat(Math.max(1, Math.min(4, Number(level) || 1)));
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatRating(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0";
  }
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

function monthLabel(month) {
  const date = new Date(`${month}-01T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return month;
  }
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function dateToTs(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function todayIso() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }
  toastTimer = window.setTimeout(() => {
    els.toast.classList.remove("show");
  }, 1800);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
