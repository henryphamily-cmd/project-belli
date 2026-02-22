"use client";

import { useEffect, useMemo, useState } from "react";

const TABS = ["discover", "lists", "diary", "feed", "profile"];

function todayIso() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function formatDate(dateString) {
  const dt = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(dt.getTime())) return dateString;
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function rating(v) {
  if (!Number.isFinite(v)) return "0";
  return Number(v).toFixed(1).replace(/\.0$/, "");
}

function price(n) {
  return "$".repeat(Math.max(1, Math.min(4, Number(n) || 1)));
}

function sameId(a, b) {
  return String(a) === String(b);
}

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [feed, setFeed] = useState([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [status, setStatus] = useState("");

  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("popular");
  const [monthFilter, setMonthFilter] = useState("all");
  const [mapsQuery, setMapsQuery] = useState("");
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResults, setMapsResults] = useState([]);
  const [importingPlaceId, setImportingPlaceId] = useState("");
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualPlaceForm, setManualPlaceForm] = useState({
    name: "",
    city: "",
    address: "",
    cuisine: "Imported",
    priceLevel: "2"
  });

  const [logForm, setLogForm] = useState({ restaurantId: "", rating: "4", date: todayIso(), note: "" });
  const [listForm, setListForm] = useState({ title: "", description: "" });

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    await Promise.all([loadRestaurants(), loadSession()]);
  }

  async function loadSession() {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setUser(data.user);
    setLogForm((prev) => ({ ...prev, restaurantId: String(data.user.watchlist[0] || data.user.logs[0]?.restaurantId || "") }));
    loadFeed();
  }

  async function loadRestaurants() {
    const res = await fetch("/api/restaurants");
    const data = await res.json();
    setRestaurants(data.restaurants || []);
  }

  async function loadFeed() {
    const res = await fetch("/api/feed", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setFeed(data.feed || []);
  }

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Login failed");
      return;
    }
    setUser(data.user);
    setStatus("Logged in.");
    setLogForm((prev) => ({ ...prev, restaurantId: String(data.user.watchlist[0] || "") }));
    loadFeed();
  }

  async function handleRegister(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(registerForm)
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Registration failed");
      return;
    }
    setUser(data.user);
    setStatus("Account created.");
    setRegisterForm({ name: "", email: "", password: "" });
    loadFeed();
  }

  async function handleLogin(e) {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);
  }

  async function handleDemoLogin() {
    await login("demo@bellibox.app", "demo123");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setFeed([]);
    setStatus("Logged out.");
  }

  async function resetDemoData() {
    await fetch("/api/bootstrap", { method: "POST" });
    setStatus("Demo database reset.");
    await loadRestaurants();
    await login("demo@bellibox.app", "demo123");
  }

  async function refreshUser() {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setUser(data.user);
  }

  async function saveLog(e) {
    e.preventDefault();
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        restaurantId: logForm.restaurantId,
        rating: Number(logForm.rating),
        date: logForm.date,
        note: logForm.note
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Could not save log");
      return;
    }
    setUser((prev) => ({
      ...prev,
      logs: data.logs,
      watchlist: prev.watchlist.filter((id) => !sameId(id, logForm.restaurantId))
    }));
    setStatus("Visit logged.");
    setLogForm((prev) => ({ ...prev, rating: "4", note: "", date: todayIso() }));
    loadFeed();
    loadRestaurants();
  }

  async function toggleWatch(restaurantId, action = "toggle") {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ restaurantId, action })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Watchlist update failed");
      return;
    }
    setUser((prev) => ({ ...prev, watchlist: data.watchlist }));
  }

  async function createList(e) {
    e.preventDefault();
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ mode: "create", title: listForm.title, description: listForm.description })
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Could not create list");
      return;
    }
    setUser((prev) => ({ ...prev, customLists: data.lists }));
    setListForm({ title: "", description: "" });
  }

  async function editList(payload) {
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "List update failed");
      return;
    }
    setUser((prev) => ({ ...prev, customLists: data.lists }));
  }

  async function saveProfile(e) {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user.profile)
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Could not save profile");
      return;
    }
    setUser((prev) => ({ ...prev, profile: data.profile }));
    setStatus("Profile saved.");
  }

  async function searchGoogleMaps(e) {
    e.preventDefault();
    const query = mapsQuery.trim();
    if (!query) {
      setStatus("Enter a restaurant name to search Google Maps.");
      return;
    }

    setMapsLoading(true);
    setStatus("");
    try {
      const params = new URLSearchParams({
        q: query
      });
      const res = await fetch(`/api/maps/search?${params.toString()}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Google Maps search failed.");
        setMapsResults([]);
        return;
      }
      setMapsResults(data.results || []);
      if (data.warning) {
        setStatus(data.warning);
      }
      if (!data.results?.length) {
        setStatus("No Google Maps results found.");
      }
    } catch (_err) {
      setStatus("Could not reach Google Maps search.");
      setMapsResults([]);
    } finally {
      setMapsLoading(false);
    }
  }

  async function importPlace(place, options = {}) {
    const { addToWatchlist = true, setForLog = true } = options;
    const markerId = String(place.resultId || place.placeId || place.name || "custom");
    setImportingPlaceId(markerId);

    try {
      if (place.existingRestaurantId !== undefined && place.existingRestaurantId !== null) {
        const existingId = place.existingRestaurantId;
        if (setForLog) {
          setLogForm((prev) => ({ ...prev, restaurantId: String(existingId) }));
        }
        if (addToWatchlist) {
          await toggleWatch(existingId, "add");
        } else {
          await refreshUser();
        }
        setStatus("Using existing Bellibox restaurant.");
        return;
      }

      const res = await fetch("/api/restaurants/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ place })
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Could not import place.");
        return;
      }

      await loadRestaurants();
      if (setForLog) {
        setLogForm((prev) => ({ ...prev, restaurantId: String(data.restaurant.id) }));
      }
      if (addToWatchlist) {
        await toggleWatch(data.restaurant.id, "add");
      } else {
        await refreshUser();
      }
      setStatus(data.created ? "Restaurant imported into Bellibox." : "Restaurant already exists in Bellibox.");
    } catch (_error) {
      setStatus("Import failed.");
    } finally {
      setImportingPlaceId("");
    }
  }

  async function addManualPlace(e) {
    e.preventDefault();
    if (!manualPlaceForm.name.trim()) {
      setStatus("Name is required for manual place add.");
      return;
    }

    await importPlace(
      {
        name: manualPlaceForm.name,
        city: manualPlaceForm.city,
        address: manualPlaceForm.address,
        cuisine: manualPlaceForm.cuisine,
        priceLevel: Number(manualPlaceForm.priceLevel || 2)
      },
      { addToWatchlist: true, setForLog: true }
    );

    setManualPlaceForm({
      name: "",
      city: "",
      address: "",
      cuisine: "Imported",
      priceLevel: "2"
    });
    setShowManualModal(false);
  }

  const cuisines = useMemo(() => Array.from(new Set(restaurants.map((r) => r.cuisine))).sort(), [restaurants]);
  const cities = useMemo(() => Array.from(new Set(restaurants.map((r) => r.city))).sort(), [restaurants]);

  const filteredRestaurants = useMemo(() => {
    const filtered = restaurants.filter((item) => {
      const q = `${item.name} ${item.city} ${item.neighborhood} ${(item.tags || []).join(" ")}`.toLowerCase();
      return (search ? q.includes(search.toLowerCase()) : true) && (cuisine === "all" || item.cuisine === cuisine) && (city === "all" || item.city === city);
    });

    filtered.sort((a, b) => {
      if (sort === "highest") return (b.community?.avg || 0) - (a.community?.avg || 0);
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.popularity - a.popularity;
    });
    return filtered;
  }, [restaurants, search, cuisine, city, sort]);

  const restaurantMap = useMemo(() => {
    const map = new Map();
    restaurants.forEach((item) => map.set(item.id, item));
    return map;
  }, [restaurants]);

  const restaurantIdSet = useMemo(
    () => new Set(restaurants.map((item) => String(item.id))),
    [restaurants]
  );

  const months = useMemo(
    () => Array.from(new Set((user?.logs || []).map((l) => l.date.slice(0, 7)))),
    [user]
  );

  const diaryEntries = useMemo(() => {
    const logs = [...(user?.logs || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
    return logs.filter((l) => (monthFilter === "all" ? true : l.date.startsWith(monthFilter)));
  }, [user, monthFilter]);

  const topRated = useMemo(() => {
    const map = new Map();
    for (const log of user?.logs || []) {
      const current = map.get(log.restaurantId);
      if (!current || log.rating > current.rating || (log.rating === current.rating && new Date(log.date) > new Date(current.date))) {
        map.set(log.restaurantId, log);
      }
    }
    return [...map.values()].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [user]);

  const avg = useMemo(() => {
    const logs = user?.logs || [];
    if (!logs.length) return 0;
    return logs.reduce((sum, l) => sum + l.rating, 0) / logs.length;
  }, [user]);

  if (!user) {
    return (
      <div className="auth-shell">
        <header className="card">
          <p className="eyebrow">Beli + Letterboxd inspired</p>
          <h1>Bellibox</h1>
          <p className="subtle">Full-stack Next.js replica with auth, API routes, and persistent data.</p>
          {status ? <p className="meta-pill" style={{ marginTop: 8 }}>{status}</p> : null}
          <div className="auth-actions" style={{ marginTop: 12 }}>
            <button className="btn solid" onClick={handleDemoLogin}>Login as Demo</button>
            <button className="btn ghost" onClick={resetDemoData}>Reset Demo DB</button>
          </div>
        </header>
        <div className="auth-grid">
          <section className="card">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <label>Email</label>
              <input value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              <label>Password</label>
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
              <button className="btn solid" type="submit" style={{ marginTop: 10 }}>Login</button>
            </form>
          </section>
          <section className="card">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <label>Name</label>
              <input value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} />
              <label>Email</label>
              <input value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              <label>Password</label>
              <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
              <button className="btn solid" type="submit" style={{ marginTop: 10 }}>Create Account</button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar card">
        <div>
          <p className="eyebrow">Beli + Letterboxd inspired</p>
          <h1>Bellibox</h1>
          <p className="subtle">Track places, rank lists, and keep a social restaurant diary.</p>
          {status ? <p className="meta-pill" style={{ marginTop: 8 }}>{status}</p> : null}
        </div>
        <div className="header-stats">
          <div className="chip"><b>{user.logs.length}</b> logged</div>
          <div className="chip"><b>{rating(avg)}</b> avg score</div>
          <div className="chip"><b>{new Set(user.logs.map((l) => l.restaurantId)).size}</b> places tried</div>
          <div className="chip"><b>{user.watchlist.length}</b> want to try</div>
        </div>
        <div className="auth-actions">
          <button className="btn ghost" onClick={resetDemoData}>Reset Demo Data</button>
          <button className="btn ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="nav card" aria-label="Primary">
        {TABS.map((tab) => (
          <button key={tab} className={`nav-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {activeTab === "discover" && (
        <main id="view-discovery" className="active">
          <aside className="card control-panel">
            <h2>Discover Restaurants</h2>
            <label>Search</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, tag, or neighborhood" />
            <label>Cuisine</label>
            <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
              <option value="all">All cuisines</option>
              {cuisines.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="all">All cities</option>
              {cities.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <label>Sort</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Popular nearby</option>
              <option value="highest">Highest rated</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
            </select>
          </aside>
          <section>
            <div className="card quick-log">
              <h2>Google Maps Search</h2>
              <form className="maps-search-form" onSubmit={searchGoogleMaps}>
                <input
                  className="maps-search-input"
                  value={mapsQuery}
                  onChange={(e) => setMapsQuery(e.target.value)}
                  placeholder="Search restaurants (e.g. Noma, sushi near me, tacos)"
                  required
                />
                <button className="btn solid" type="submit">
                  {mapsLoading ? "Searching..." : "Search Maps"}
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => setShowManualModal(true)}
                >
                  Add Manually
                </button>
              </form>
              <div className="maps-results">
                {mapsResults.map((place) => {
                  const importedId = place.placeId ? `g:${place.placeId}` : "";
                  const exists = place.existingRestaurantId !== undefined
                    ? restaurantIdSet.has(String(place.existingRestaurantId))
                    : importedId
                      ? restaurantIdSet.has(importedId)
                      : false;
                  const isImporting =
                    importingPlaceId === String(place.resultId || place.placeId || place.name || "");

                  return (
                    <article key={place.resultId || `${place.name}-${place.address}`} className="map-result-item">
                      <header>
                        <h3>{place.name}</h3>
                        <span className="meta-pill">
                          {place.priceLevel ? "$".repeat(place.priceLevel) : "N/A"}
                        </span>
                      </header>
                      <p className="subtle">{place.address || "No address provided"}</p>
                      <div className="meta-row">
                        <span className="meta-pill">
                          {place.rating ? `${rating(place.rating)} stars` : "No rating"}
                        </span>
                        <span className="meta-pill">
                          {place.userRatingsTotal || 0} reviews
                        </span>
                        <span className="meta-pill">
                          {place.openNow === null
                            ? "Hours unknown"
                            : place.openNow
                              ? "Open now"
                              : "Closed now"}
                        </span>
                      </div>
                      <div className="button-row">
                        <button
                          className="btn small solid"
                          type="button"
                          disabled={isImporting}
                          onClick={() => importPlace(place, { addToWatchlist: true, setForLog: true })}
                        >
                          {exists ? "Use in Bellibox" : isImporting ? "Importing..." : "Import to Bellibox"}
                        </button>
                        <a
                          className="btn small ghost"
                          href={place.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="card quick-log">
              <h2>Log a Visit</h2>
              <form onSubmit={saveLog}>
                <label>Restaurant</label>
                <select value={logForm.restaurantId} onChange={(e) => setLogForm({ ...logForm, restaurantId: e.target.value })} required>
                  <option value="">Select a restaurant</option>
                  {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name} - {r.city}</option>)}
                </select>
                <label>Rating (0.5 to 5)</label>
                <input type="number" min="0.5" max="5" step="0.5" value={logForm.rating} onChange={(e) => setLogForm({ ...logForm, rating: e.target.value })} required />
                <label>Date</label>
                <input type="date" value={logForm.date} onChange={(e) => setLogForm({ ...logForm, date: e.target.value })} required />
                <label>Quick note</label>
                <textarea rows={2} value={logForm.note} onChange={(e) => setLogForm({ ...logForm, note: e.target.value })} />
                <button className="btn solid" type="submit">Save Log</button>
              </form>
            </div>
            <div className="card">
              <h2>Nearby Picks</h2>
              <div className="restaurant-grid">
                {filteredRestaurants.map((r, idx) => {
                  const isSaved = user.watchlist.includes(r.id);
                  return (
                    <article key={r.id} className="restaurant-card reveal" style={{ "--delay": `${idx * 0.03}s` }}>
                      <img src={r.image} alt={r.name} loading="lazy" />
                      <h3>{r.name}</h3>
                      <div className="meta-row">
                        <span className="meta-pill">{r.cuisine}</span>
                        <span className="meta-pill">{r.city}</span>
                        <span className="meta-pill">{price(r.price)}</span>
                      </div>
                      <p className="subtle">{r.neighborhood}</p>
                      <p className="rating">{r.community.count ? `${rating(r.community.avg)} avg from ${r.community.count} logs` : "No ratings yet"}</p>
                      <div className="button-row">
                        <button className="btn small ghost" onClick={() => toggleWatch(r.id, "toggle")}>{isSaved ? "Remove Want to Try" : "Want to Try"}</button>
                        <button className="btn small solid" onClick={() => setLogForm({ ...logForm, restaurantId: String(r.id) })}>Log Visit</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      )}

      {activeTab === "lists" && (
        <main>
          <div className="card">
            <h2>Create a Custom List</h2>
            <form className="inline-form" onSubmit={createList}>
              <input value={listForm.title} onChange={(e) => setListForm({ ...listForm, title: e.target.value })} placeholder="List name" required />
              <input value={listForm.description} onChange={(e) => setListForm({ ...listForm, description: e.target.value })} placeholder="Description" />
              <button className="btn solid" type="submit">Create</button>
            </form>
          </div>
          <div className="card">
            <h2>Want to Try</h2>
            <div className="watchlist-grid">
              {user.watchlist.map((id) => {
                const r = restaurantMap.get(id);
                if (!r) return null;
                return (
                  <article key={id} className="watch-item">
                    <header>
                      <h3>{r.name}</h3>
                      <span className="meta-pill">{price(r.price)}</span>
                    </header>
                    <p className="subtle">{r.city} | {r.cuisine}</p>
                    <div className="button-row">
                      <button className="btn small ghost" onClick={() => toggleWatch(id, "remove")}>Remove</button>
                      <button className="btn small solid" onClick={() => { setActiveTab("discover"); setLogForm({ ...logForm, restaurantId: String(id) }); }}>Log Visit</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="list-grid">
            {user.customLists.map((list) => (
              <article key={list.id} className="list-card">
                <header>
                  <h3>{list.title}</h3>
                  <button className="btn small ghost" onClick={() => editList({ mode: "delete", listId: list.id })}>Delete</button>
                </header>
                <p className="subtle">{list.description || "No description"}</p>
                <ul className="flat-list">
                  {list.itemIds.map((rid) => {
                    const place = restaurantMap.get(rid);
                    if (!place) return null;
                    return (
                      <li key={rid}>
                        <span>{place.name}</span>
                        <button className="btn small ghost" onClick={() => editList({ mode: "remove-item", listId: list.id, restaurantId: rid })}>Remove</button>
                      </li>
                    );
                  })}
                </ul>
                <div className="inline-form">
                  <select defaultValue="" onChange={(e) => e.target.dataset.selected = e.target.value}>
                    <option value="">Add a restaurant</option>
                    {restaurants.filter((r) => !list.itemIds.includes(r.id)).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button className="btn small solid" type="button" onClick={(e) => {
                    const select = e.currentTarget.parentElement.querySelector("select");
                    const rid = String(select?.dataset.selected || select?.value || "").trim();
                    if (rid) editList({ mode: "add-item", listId: list.id, restaurantId: rid });
                  }}>Add</button>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {activeTab === "diary" && (
        <main>
          <div className="card diary-toolbar">
            <h2>Diary</h2>
            <div className="inline-form">
              <label>Month</label>
              <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
                <option value="all">All months</option>
                {months.map((month) => <option key={month} value={month}>{month}</option>)}
              </select>
            </div>
          </div>
          <div className="card">
            <div className="diary-timeline">
              {diaryEntries.map((entry) => {
                const r = restaurantMap.get(entry.restaurantId);
                if (!r) return null;
                return (
                  <article key={entry.id} className="diary-item">
                    <header>
                      <h3>{r.name}</h3>
                      <span className="meta-pill">{formatDate(entry.date)}</span>
                    </header>
                    <p className="rating">{rating(entry.rating)} / 5</p>
                    <p className="subtle">{r.city} | {r.cuisine}</p>
                    <p>{entry.note || "No note."}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {activeTab === "feed" && (
        <main>
          <div className="card">
            <h2>Activity Feed</h2>
            <div className="feed-list">
              {feed.map((item) => {
                const restaurant = restaurantMap.get(item.restaurantId);
                const text = item.type === "watch"
                  ? `added ${restaurant?.name || "a restaurant"} to Want to Try`
                  : `logged ${restaurant?.name || "a restaurant"} with ${rating(item.rating)}/5`;
                return (
                  <article key={item.id} className="feed-item">
                    <header>
                      <h3>{item.actor}</h3>
                      <span className="meta-pill">{formatDate(item.date)}</span>
                    </header>
                    <p>{text}</p>
                    {item.note ? <p className="subtle">"{item.note}"</p> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {activeTab === "profile" && (
        <main>
          <div className="card profile-head">
            <h2>Profile</h2>
            <form className="profile-form" onSubmit={saveProfile}>
              <label>Display name</label>
              <input value={user.profile.name} onChange={(e) => setUser({ ...user, profile: { ...user.profile, name: e.target.value } })} />
              <label>Handle</label>
              <input value={user.profile.handle} onChange={(e) => setUser({ ...user, profile: { ...user.profile, handle: e.target.value } })} />
              <label>Bio</label>
              <textarea rows={2} value={user.profile.bio} onChange={(e) => setUser({ ...user, profile: { ...user.profile, bio: e.target.value } })} />
              <button className="btn solid" type="submit">Save Profile</button>
            </form>
          </div>
          <div className="card">
            <h2>{user.profile.name} <span className="subtle">{user.profile.handle}</span></h2>
            <p className="subtle">{user.profile.bio || "No bio yet."}</p>
            <div className="stats-grid">
              <div className="stat-card"><div className="k">{user.logs.length}</div><div>Entries</div></div>
              <div className="stat-card"><div className="k">{rating(avg)}</div><div>Average</div></div>
              <div className="stat-card"><div className="k">{new Set(user.logs.map((l) => restaurantMap.get(l.restaurantId)?.city)).size}</div><div>Cities explored</div></div>
              <div className="stat-card"><div className="k">{user.customLists.length + 1}</div><div>Active lists</div></div>
            </div>
          </div>
          <div className="card">
            <h2>Top Rated Places</h2>
            {topRated.map((entry) => {
              const r = restaurantMap.get(entry.restaurantId);
              if (!r) return null;
              return (
                <article key={entry.id} className="list-card">
                  <header>
                    <h3>{r.name}</h3>
                    <span className="rating">{rating(entry.rating)} / 5</span>
                  </header>
                  <p className="subtle">{r.city} | logged {formatDate(entry.date)}</p>
                </article>
              );
            })}
          </div>
        </main>
      )}

      {showManualModal && (
        <div className="modal-backdrop" onClick={() => setShowManualModal(false)}>
          <div className="modal-card card" onClick={(e) => e.stopPropagation()}>
            <header className="modal-head">
              <h2>Add Place Manually</h2>
              <button className="btn small ghost" type="button" onClick={() => setShowManualModal(false)}>
                Close
              </button>
            </header>
            <form className="manual-modal-form" onSubmit={addManualPlace}>
              <label>Restaurant name</label>
              <input
                value={manualPlaceForm.name}
                onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, name: e.target.value })}
                placeholder="Restaurant name"
                required
              />
              <label>City</label>
              <input
                value={manualPlaceForm.city}
                onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, city: e.target.value })}
                placeholder="City"
              />
              <label>Address</label>
              <input
                value={manualPlaceForm.address}
                onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, address: e.target.value })}
                placeholder="Address"
              />
              <label>Cuisine</label>
              <input
                value={manualPlaceForm.cuisine}
                onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, cuisine: e.target.value })}
                placeholder="Cuisine"
              />
              <label>Price level</label>
              <select
                value={manualPlaceForm.priceLevel}
                onChange={(e) => setManualPlaceForm({ ...manualPlaceForm, priceLevel: e.target.value })}
              >
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
              </select>
              <div className="button-row">
                <button className="btn solid" type="submit">
                  Add to Bellibox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
