const viewButtons = document.querySelectorAll(".view-button");
const views = {
  wall: document.querySelector("#wall-view"),
  tasks: document.querySelector("#tasks-view"),
  dashboard: document.querySelector("#dashboard-view"),
  system: document.querySelector("#system-view"),
};

function activateView(target) {
  const resolvedTarget = views[target] ? target : "wall";
  viewButtons.forEach((candidate) => {
    candidate.classList.toggle("active", candidate.dataset.view === resolvedTarget);
  });
  Object.entries(views).forEach(([name, view]) => view.classList.toggle("active", name === resolvedTarget));
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.view;
    activateView(target);
    const url = new URL(window.location.href);
    url.searchParams.set("view", target);
    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const privacyToggle = document.querySelector("#privacy-toggle");
const sensitiveValues = document.querySelectorAll(".sensitive");

privacyToggle.addEventListener("click", () => {
  const masked = privacyToggle.getAttribute("aria-pressed") !== "true";
  privacyToggle.setAttribute("aria-pressed", String(masked));
  privacyToggle.title = masked ? "Show financial values" : "Mask financial values";
  sensitiveValues.forEach((element) => {
    element.textContent = masked ? "••••••••" : element.dataset.value;
    element.classList.toggle("masked", masked);
  });
});

function renderHealthChart() {
  const svg = document.querySelector(".line-chart");
  const values = [49, 58, 54, 66, 61, 73, 68, 77, 71, 83, 79, 88, 85, 92];
  const width = 600;
  const height = 120;
  const padding = 8;
  const min = 40;
  const max = 100;
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
    return [x, y];
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${padding},${height} ${line} ${width - padding},${height}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ff8e7a" stop-opacity=".22"></stop>
        <stop offset="100%" stop-color="#ff8e7a" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    <line class="grid-line" x1="0" y1="30" x2="600" y2="30"></line>
    <line class="grid-line" x1="0" y1="75" x2="600" y2="75"></line>
    <line class="grid-line" x1="0" y1="119" x2="600" y2="119"></line>
    <polygon class="area" points="${area}"></polygon>
    <polyline class="line" points="${line}"></polyline>
    <circle class="dot" cx="${points.at(-1)[0]}" cy="${points.at(-1)[1]}" r="4"></circle>
  `;
}

function updateClock() {
  const now = new Date();
  document.querySelector("#clock-time").textContent = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  document.querySelector("#clock-date").textContent = now
    .toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase()
    .replace(",", " ·");
}

const sceneButtons = [...document.querySelectorAll("[data-scene]")];
const scenePanels = [...document.querySelectorAll("[data-scene-panel]")];
const sceneTitles = {
  forecast: "Forecast: three possible paths",
  physique: "Body: signal over daily noise",
  weeks: "Life in Weeks: direction over urgency",
};
let currentScene = 0;
let sceneRotation;

function activateScene(sceneName) {
  currentScene = Math.max(0, sceneButtons.findIndex((button) => button.dataset.scene === sceneName));
  sceneButtons.forEach((button) => {
    const active = button.dataset.scene === sceneName;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  scenePanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.scenePanel === sceneName));
  document.querySelector("#scene-title").textContent = sceneTitles[sceneName];
}

function startSceneRotation() {
  clearInterval(sceneRotation);
  sceneRotation = setInterval(() => {
    currentScene = (currentScene + 1) % sceneButtons.length;
    activateScene(sceneButtons[currentScene].dataset.scene);
  }, 30_000);
}

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activateScene(button.dataset.scene);
    startSceneRotation();
  });
});

const weekSample = document.querySelector(".week-sample");
for (let index = 0; index < 104; index += 1) {
  const week = document.createElement("i");
  week.className = index < 58 ? "lived" : index === 58 ? "current" : index > 88 ? "future" : "";
  weekSample.appendChild(week);
}

const taskStages = ["todo", "research", "plan", "progress", "done"];
const taskStorageKey = "northstar-kanban-v1";
const taskCards = [...document.querySelectorAll(".task-card")];
const taskDropzones = [...document.querySelectorAll("[data-dropzone]")];

function taskStage(card) {
  return card.closest("[data-dropzone]").dataset.dropzone;
}

function renderTaskBoard() {
  document.querySelectorAll(".kanban-column").forEach((column) => {
    const count = column.querySelectorAll(".task-card").length;
    column.querySelector(".column-count").textContent = count;
  });

  const doneCount = document.querySelectorAll('[data-dropzone="done"] .task-card').length;
  document.querySelector("#done-task-count").textContent = doneCount;
  document.querySelector("#open-task-count").textContent = taskCards.length - doneCount;

  taskCards.forEach((card) => {
    const stageIndex = taskStages.indexOf(taskStage(card));
    card.classList.toggle("completed", stageIndex === taskStages.length - 1);
    const controls = card.querySelector(".move-controls");
    const title = card.querySelector("h3").textContent;
    controls.innerHTML = "";
    if (stageIndex > 0) {
      const previous = document.createElement("button");
      previous.dataset.move = "previous";
      previous.setAttribute("aria-label", `Move ${title} backward`);
      previous.innerHTML = "&larr;";
      controls.appendChild(previous);
    }
    if (stageIndex < taskStages.length - 1) {
      const next = document.createElement("button");
      next.dataset.move = "next";
      next.setAttribute("aria-label", `Move ${title} forward`);
      next.innerHTML = "&rarr;";
      controls.appendChild(next);
    }
  });
}

function saveTaskBoard() {
  const state = Object.fromEntries(taskDropzones.map((zone) => [
    zone.dataset.dropzone,
    [...zone.querySelectorAll(".task-card")].map((card) => card.dataset.taskId),
  ]));
  localStorage.setItem(taskStorageKey, JSON.stringify(state));
}

function moveTask(card, destination) {
  const zone = document.querySelector(`[data-dropzone="${destination}"]`);
  if (!zone) return;
  zone.appendChild(card);
  renderTaskBoard();
  saveTaskBoard();
}

function restoreTaskBoard() {
  try {
    const state = JSON.parse(localStorage.getItem(taskStorageKey));
    if (!state) return;
    taskStages.forEach((stage) => {
      (state[stage] || []).forEach((taskId) => {
        const card = document.querySelector(`[data-task-id="${taskId}"]`);
        if (card) document.querySelector(`[data-dropzone="${stage}"]`).appendChild(card);
      });
    });
  } catch {
    localStorage.removeItem(taskStorageKey);
  }
}

taskCards.forEach((card) => {
  card.addEventListener("dragstart", (event) => {
    card.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.taskId);
  });
  card.addEventListener("dragend", () => card.classList.remove("dragging"));
});

taskDropzones.forEach((zone) => {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    const card = document.querySelector(`[data-task-id="${event.dataTransfer.getData("text/plain")}"]`);
    if (card) moveTask(card, zone.dataset.dropzone);
  });
});

document.querySelector(".kanban-board").addEventListener("click", (event) => {
  const button = event.target.closest("[data-move]");
  if (!button) return;
  const card = button.closest(".task-card");
  const currentIndex = taskStages.indexOf(taskStage(card));
  const offset = button.dataset.move === "next" ? 1 : -1;
  moveTask(card, taskStages[currentIndex + offset]);
});

renderHealthChart();
restoreTaskBoard();
renderTaskBoard();
activateView(new URLSearchParams(window.location.search).get("view"));
activateScene("forecast");
startSceneRotation();
updateClock();
setInterval(updateClock, 30_000);
