// ===================== THEME =====================
const themeBtn = document.getElementById("themeBtn");
const themeBox = document.getElementById("themeBox");

themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeBox.classList.toggle("open");
});

document.addEventListener("click", () => themeBox.classList.remove("open"));

themeBox.querySelectorAll("h4").forEach((h4) => {
  h4.addEventListener("click", () => {
    const t = h4.dataset.theme;
    document.body.dataset.theme = t;
    localStorage.setItem("theme", t);
    themeBox.classList.remove("open");
  });
});

// Restore saved theme on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme !== null) document.body.dataset.theme = savedTheme;

// ===================== PAGE NAVIGATION =====================
document.querySelectorAll(".card[data-open]").forEach((card) => {
  card.addEventListener("click", () => {
    const id = card.dataset.open;
    const page = document.getElementById("page-" + id);
    if (page) {
      page.classList.add("active");
      document.getElementById("dashboard").style.display = "none";
      // Hide theme controls so they don't overlap the close button
      document.getElementById("themeBtn").classList.add("hidden");
      document.getElementById("themeBox").classList.remove("open");
    }
  });
});

document.querySelectorAll(".close-btn[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.close;
    const page = document.getElementById("page-" + id);
    if (page) {
      page.classList.remove("active");
      document.getElementById("dashboard").style.display = "flex";
      // Restore theme button
      document.getElementById("themeBtn").classList.remove("hidden");
    }
  });
});

// ===================== DATE & TIME =====================
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function updateDateTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  document.getElementById("htime").textContent =
    `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} ${ampm}`;
  document.getElementById("hdate").textContent =
    `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById("hday").textContent = DAYS[now.getDay()];

  // Change header background image by time of day
  const bg = document.getElementById("headerStrip");
  const imgs = [
    "photo-1470252649378-9c29740c9fa8", // night   (0–5)
    "photo-1500534314209-a25ddb2bd429", // dawn    (6–8)
    "photo-1506905925346-21bda4d32df4", // morning (9–12)
    "photo-1472214103451-9374bd1c798e", // afternoon (13–16)
    "photo-1471922694854-ff1b63b20054", // evening (17–19)
  ];
  const idx = h < 6 ? 0 : h < 9 ? 1 : h < 13 ? 2 : h < 17 ? 3 : h < 20 ? 4 : 0;
  bg.style.backgroundImage = `url('https://images.unsplash.com/${imgs[idx]}?w=1200&auto=format&fit=crop&q=80')`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ===================== WEATHER =====================
let currentCity = "Nagpur";
const WEATHER_KEY = "a0f0825325d143aa9e4142447262903";

async function fetchWeather(city) {
  try {
    const r = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${WEATHER_KEY}&q=${city}`,
    );
    if (!r.ok) throw new Error("City not found");
    const d = await r.json();
    document.getElementById("hcity").textContent =
      d.location.name + ", " + d.location.country;
    document.getElementById("htemp").textContent = d.current.temp_c + " °C";
    document.getElementById("hhumidity").textContent =
      "Humidity: " + d.current.humidity + "%";
    document.getElementById("hwind").textContent =
      "Wind: " + d.current.wind_kph + " km/h";
    document.getElementById("hprecip").textContent =
      "Precip: " + d.current.precip_mm + " mm";
    document.getElementById("hcondition").textContent =
      d.current.condition.text;
    currentCity = city;
  } catch (e) {
    document.getElementById("hcity").textContent = "Weather unavailable";
  }
}

fetchWeather(currentCity);

document.getElementById("citySearchBtn").addEventListener("click", () => {
  const val = document.getElementById("cityInput").value.trim();
  if (val) fetchWeather(val);
});

document.getElementById("cityInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const val = e.target.value.trim();
    if (val) fetchWeather(val);
  }
});

// ===================== TODO =====================
let tasks = JSON.parse(localStorage.getItem("tasks_v2")) || [];

function saveTasks() {
  localStorage.setItem("tasks_v2", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const sorted = [...tasks]
    .map((t, i) => ({ ...t, i }))
    .sort((a, b) => b.important - a.important);

  if (!sorted.length) {
    list.innerHTML = '<div class="empty-state">No tasks yet. Add one!</div>';
    return;
  }

  list.innerHTML = sorted
    .map(
      (t) => `
    <div class="task-item ${t.important ? "important" : ""}">
      <div class="task-info">
        <h5>${t.task}${t.important ? '<span class="imp-tag">IMP</span>' : ""}</h5>
        ${t.details ? `<span>${t.details}</span>` : ""}
      </div>
      <button class="complete-btn" data-idx="${t.i}">Done ✓</button>
    </div>
  `,
    )
    .join("");
}

document.getElementById("addTaskBtn").addEventListener("click", () => {
  const name = document.getElementById("taskInput").value.trim();
  if (!name) return;
  tasks.push({
    task: name,
    details: document.getElementById("taskDetails").value.trim(),
    important: document.getElementById("impCheck").checked,
  });
  saveTasks();
  renderTasks();
  document.getElementById("taskInput").value = "";
  document.getElementById("taskDetails").value = "";
  document.getElementById("impCheck").checked = false;
});

document.getElementById("taskList").addEventListener("click", (e) => {
  const btn = e.target.closest(".complete-btn");
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  if (confirm("Mark task as completed?")) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
  }
});

renderTasks();

// ===================== DAILY PLANNER =====================
function buildPlanner() {
  const grid = document.getElementById("plannerGrid");
  const saved = JSON.parse(localStorage.getItem("planner_v2")) || {};
  let html = "";

  for (let i = 6; i <= 23; i++) {
    const sh = i % 12 || 12;
    const eh = (i + 1) % 12 || 12;
    const sa = i < 12 ? "AM" : "PM";
    const ea = i + 1 < 12 ? "AM" : "PM";
    const label = `${sh}:00 ${sa} – ${eh}:00 ${ea}`;
    html += `
      <div class="time-block">
        <div class="time-label">${label}</div>
        <input class="plan-input" data-time="${label}" placeholder="What's planned..." value="${saved[label] || ""}">
        <button class="clear-time" data-time="${label}"><i class="ri-close-line"></i></button>
      </div>`;
  }
  grid.innerHTML = html;

  grid.addEventListener("input", (e) => {
    if (e.target.classList.contains("plan-input")) {
      const s = JSON.parse(localStorage.getItem("planner_v2")) || {};
      s[e.target.dataset.time] = e.target.value;
      localStorage.setItem("planner_v2", JSON.stringify(s));
    }
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".clear-time");
    if (!btn) return;
    const t = btn.dataset.time;
    const inp = grid.querySelector(`.plan-input[data-time="${t}"]`);
    if (inp) inp.value = "";
    const s = JSON.parse(localStorage.getItem("planner_v2")) || {};
    delete s[t];
    localStorage.setItem("planner_v2", JSON.stringify(s));
  });
}

buildPlanner();

// ===================== MOTIVATION =====================
async function fetchQuote() {
  const el = document.getElementById("quoteText");
  const au = document.getElementById("quoteAuthor");
  el.textContent = "Loading...";
  try {
    const r = await fetch("https://dummyjson.com/quotes/random");
    const d = await r.json();
    el.textContent = d.quote;
    au.textContent = d.author;
  } catch {
    el.textContent = "Stay focused. Every day counts.";
    au.textContent = "Unknown";
  }
}

fetchQuote();
document.getElementById("refreshQuote").addEventListener("click", fetchQuote);

// ===================== POMODORO =====================
let pomoIsStudy = true;
let pomoTotal = 25 * 60;
let pomoCurrent = 25 * 60;
let pomoInterval = null;
const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const pomoTimeEl = document.getElementById("pomoTime");
const sessionBadge = document.getElementById("sessionBadge");
const progBar = document.getElementById("pomoProgressBar");

function updatePomoDisplay() {
  const m = String(Math.floor(pomoCurrent / 60)).padStart(2, "0");
  const s = String(pomoCurrent % 60).padStart(2, "0");
  pomoTimeEl.textContent = `${m}:${s}`;
  progBar.style.width = (pomoCurrent / pomoTotal) * 100 + "%";
}

updatePomoDisplay();

function startPomo() {
  clearInterval(pomoInterval);
  pomoTimeEl.classList.add("running");
  document.getElementById("startBtn").textContent = "Running…";

  pomoInterval = setInterval(() => {
    if (pomoCurrent > 0) {
      pomoCurrent--;
      updatePomoDisplay();
    } else {
      clearInterval(pomoInterval);
      pomoIsStudy = !pomoIsStudy;
      pomoTotal = pomoIsStudy ? WORK_TIME : BREAK_TIME;
      pomoCurrent = pomoTotal;
      sessionBadge.textContent = pomoIsStudy ? "Work Session" : "Break Time!";
      sessionBadge.classList.toggle("break", !pomoIsStudy);
      document.getElementById("startBtn").textContent = "Start";
      pomoTimeEl.classList.remove("running");
      updatePomoDisplay();
    }
  }, 1000);
}

document.getElementById("startBtn").addEventListener("click", startPomo);

document.getElementById("pauseBtn").addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoTimeEl.classList.remove("running");
  document.getElementById("startBtn").textContent = "Resume";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoIsStudy = true;
  pomoTotal = WORK_TIME;
  pomoCurrent = WORK_TIME;
  sessionBadge.textContent = "Work Session";
  sessionBadge.classList.remove("break");
  pomoTimeEl.classList.remove("running");
  document.getElementById("startBtn").textContent = "Start";
  updatePomoDisplay();
});

// ===================== GOALS =====================
let goals = JSON.parse(localStorage.getItem("goals_v2")) || [];

function saveGoals() {
  localStorage.setItem("goals_v2", JSON.stringify(goals));
}

function renderGoals() {
  const list = document.getElementById("goalList");
  const total = goals.length;
  const done = goals.filter((g) => g.status === "completed").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("goalPercent").textContent = pct + "%";
  document.getElementById("goalProgress").style.width = pct + "%";

  if (!goals.length) {
    list.innerHTML = '<div class="empty-state">No goals yet!</div>';
    return;
  }

  list.innerHTML = goals
    .map(
      (g, i) => `
    <div class="goal-item ${g.status}">
      <span class="goal-text">${
        g.status === "completed" ? "✅" : g.status === "failed" ? "❌" : "⏳"
      } ${g.text}</span>
      <div class="goal-actions">
        <button data-gidx="${i}" data-gstatus="completed" title="Complete">✅</button>
        <button data-gidx="${i}" data-gstatus="pending"   title="Pending">⏳</button>
        <button data-gidx="${i}" data-gstatus="failed"    title="Failed">❌</button>
        <button data-gidx="${i}" data-gstatus="delete"    title="Delete">🗑️</button>
      </div>
    </div>
  `,
    )
    .join("");
}

document.getElementById("addGoalBtn").addEventListener("click", () => {
  const text = prompt("Enter your goal:");
  if (text && text.trim()) {
    goals.push({ text: text.trim(), status: "pending" });
    saveGoals();
    renderGoals();
  }
});

document.getElementById("goalList").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-gidx]");
  if (!btn) return;
  const idx = Number(btn.dataset.gidx);
  const st = btn.dataset.gstatus;
  if (st === "delete") {
    goals.splice(idx, 1);
  } else {
    goals[idx].status = st;
  }
  saveGoals();
  renderGoals();
});

renderGoals();
