"use strict";

function buildSyntheticHistory() {
  const anchors = [
    { age: 27.5, value: 64000 },
    { age: 28.5, value: 89000 },
    { age: 29.5, value: 121000 },
    { age: 30.5, value: 158000 },
    { age: 31.5, value: 207000 },
    { age: 32.4, value: 248600 },
  ];
  const points = [];
  const monthCount = Math.round((anchors.at(-1).age - anchors[0].age) * 12);

  for (let month = 0; month <= monthCount; month += 1) {
    const age = anchors[0].age + month / 12;
    const upperIndex = Math.min(
      anchors.length - 1,
      Math.max(1, anchors.findIndex((anchor) => anchor.age >= age)),
    );
    const lower = anchors[upperIndex - 1];
    const upper = anchors[upperIndex];
    const progress = Math.min(1, Math.max(0, (age - lower.age) / (upper.age - lower.age)));
    const baseline = lower.value + (upper.value - lower.value) * progress;
    const noise = Math.sin(month * 1.71) * 0.025 + Math.sin(month * 0.53) * 0.018;
    points.push({ age, value: baseline * (1 + noise) });
  }

  points[0] = anchors[0];
  points[points.length - 1] = anchors.at(-1);
  return points;
}

const financialDemo = {
  asOfYear: 2026.72,
  currentAge: 32.4,
  monthlyContribution: 3000,
  benchmarkInflation: 0.025,
  displayPriceYear: 2026,
  endingAge: 55,
  targets: [
    { id: "lean", label: "Lean", value: 375000 },
    { id: "medium", label: "Medium", value: 1000000 },
    { id: "fat", label: "Fat", value: 2000000 },
  ],
  scenarioRates: {
    conservative: 0.02,
    base: 0.045,
    optimistic: 0.07,
  },
  history: buildSyntheticHistory(),
};

const state = {
  benchmark: null,
  forecasts: {},
  geometry: null,
  hoverAge: null,
  masked: false,
  range: "max",
  style: "area",
  layers: {
    benchmarks: true,
    targets: true,
    conservative: false,
    optimistic: false,
  },
};

const chart = document.querySelector("#fi-chart");
const chartFrame = document.querySelector("#chart-frame");
const hoverCard = document.querySelector("#hover-card");
const privacyToggle = document.querySelector("#privacy-toggle");

function cssValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function formatCurrency(value, compact = false) {
  if (value == null || Number.isNaN(value)) return "—";
  if (compact && Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(value >= 10000000 ? 1 : 2).replace(/\.0+$|(?<=\.[0-9])0$/, "")}M`;
  }
  if (compact && Math.abs(value) >= 1000) return `$${Math.round(value / 1000)}K`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value, digits = 1) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(digits)}%`;
}

function formatAxisCurrency(value) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1).replace(/\.0$/, "")}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;
  return `$${Math.round(value)}`;
}

function projectBalance(annualRealReturn) {
  const points = [{ age: financialDemo.currentAge, value: financialDemo.history.at(-1).value }];
  const monthlyRate = Math.pow(1 + annualRealReturn, 1 / 12) - 1;
  const monthCount = Math.ceil((financialDemo.endingAge - financialDemo.currentAge) * 12);
  let balance = points[0].value;

  for (let month = 1; month <= monthCount; month += 1) {
    balance = balance * (1 + monthlyRate) + financialDemo.monthlyContribution;
    if (month % 3 === 0 || month === monthCount) {
      points.push({ age: financialDemo.currentAge + month / 12, value: balance });
    }
  }
  return points;
}

function interpolate(points, age, key = "value") {
  if (!points?.length || age < points[0].age || age > points.at(-1).age) return null;
  const upperIndex = points.findIndex((point) => point.age >= age);
  if (upperIndex <= 0) return points[0][key];
  const lower = points[upperIndex - 1];
  const upper = points[upperIndex];
  if (upper.age === lower.age) return upper[key];
  const progress = (age - lower.age) / (upper.age - lower.age);
  return lower[key] + (upper[key] - lower[key]) * progress;
}

function portfolioValue(age, scenario = "base") {
  if (age <= financialDemo.currentAge) return interpolate(financialDemo.history, age);
  return interpolate(state.forecasts[scenario], age);
}

function benchmarkValue(age, field) {
  if (!state.benchmark) return null;
  const adjustment = Math.pow(
    1 + financialDemo.benchmarkInflation,
    financialDemo.displayPriceYear - state.benchmark.price_year,
  );
  const value = interpolate(state.benchmark.values, age, field);
  return value == null ? null : value * adjustment;
}

function yearAtAge(age) {
  return financialDemo.asOfYear + (age - financialDemo.currentAge);
}

function calendarLabel(decimalYear, includeMonth = true) {
  const year = Math.floor(decimalYear);
  if (!includeMonth) return String(year);
  const month = Math.min(11, Math.max(0, Math.floor((decimalYear - year) * 12)));
  const monthName = new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(2024, month, 1));
  return `${monthName} ${year}`;
}

function rangeMaximumAge() {
  if (state.range === "history") return financialDemo.currentAge;
  if (state.range === "age50") return 50;
  if (state.range === "max") return financialDemo.endingAge;
  return Math.min(financialDemo.endingAge, financialDemo.currentAge + Number(state.range));
}

function visiblePoints(points, minimumAge, maximumAge) {
  return points.filter((point) => point.age >= minimumAge && point.age <= maximumAge);
}

function niceTicks(maximum, target = 5) {
  if (!(maximum > 0)) return [0];
  const raw = maximum / target;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const normalized = raw / magnitude;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10) * magnitude;
  const ticks = [];
  for (let value = 0; value <= maximum + step * 0.01; value += step) ticks.push(value);
  return ticks;
}

function setupCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const width = chart.clientWidth;
  const height = chart.clientHeight;
  chart.width = Math.round(width * dpr);
  chart.height = Math.round(height * dpr);
  const context = chart.getContext("2d");
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  return { context, width, height };
}

function decimate(points, x, y, pixelWidth) {
  if (points.length <= pixelWidth * 2) return points.map((point) => [x(point.age), y(point.value)]);
  const output = [];
  const pointsPerPixel = points.length / pixelWidth;
  for (let column = 0; column < pixelWidth; column += 1) {
    const start = Math.floor(column * pointsPerPixel);
    const end = Math.min(points.length, Math.floor((column + 1) * pointsPerPixel));
    const bucket = points.slice(start, Math.max(start + 1, end));
    const minimum = bucket.reduce((best, point) => point.value < best.value ? point : best, bucket[0]);
    const maximum = bucket.reduce((best, point) => point.value > best.value ? point : best, bucket[0]);
    [minimum, maximum].sort((a, b) => a.age - b.age).forEach((point) => output.push([x(point.age), y(point.value)]));
  }
  return output;
}

function tracePath(context, points) {
  if (!points.length) return;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1) context.lineTo(points[index][0], points[index][1]);
}

function drawSeries(context, points, x, y, color, options = {}) {
  if (!points.length) return;
  const rendered = decimate(points, x, y, Math.max(2, Math.round(state.geometry.plotWidth)));
  context.save();
  context.strokeStyle = color;
  context.lineWidth = options.width ?? 1.6;
  context.lineJoin = "round";
  context.lineCap = "round";
  context.globalAlpha = options.alpha ?? 1;
  context.setLineDash(options.dash ?? []);
  tracePath(context, rendered);
  context.stroke();
  context.restore();
}

function drawChart() {
  const { context, width, height } = setupCanvas();
  const margin = {
    left: width < 500 ? 49 : 63,
    right: width < 500 ? 10 : 16,
    top: 18,
    bottom: 27,
  };
  const minimumAge = financialDemo.history[0].age;
  const maximumAge = rangeMaximumAge();
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  if (plotWidth < 40 || plotHeight < 40 || maximumAge <= minimumAge) return;

  const history = visiblePoints(financialDemo.history, minimumAge, maximumAge);
  const base = visiblePoints(state.forecasts.base, financialDemo.currentAge, maximumAge);
  const conservative = state.layers.conservative
    ? visiblePoints(state.forecasts.conservative, financialDemo.currentAge, maximumAge)
    : [];
  const optimistic = state.layers.optimistic
    ? visiblePoints(state.forecasts.optimistic, financialDemo.currentAge, maximumAge)
    : [];
  const benchmarkRows = state.benchmark
    ? state.benchmark.values.filter((row) => row.age >= Math.ceil(minimumAge) && row.age <= maximumAge)
    : [];
  const p90 = state.layers.benchmarks
    ? benchmarkRows.map((row) => ({ age: row.age, value: benchmarkValue(row.age, "p90") }))
    : [];
  const p95 = state.layers.benchmarks
    ? benchmarkRows.map((row) => ({ age: row.age, value: benchmarkValue(row.age, "p95") }))
    : [];

  const visibleValues = [history, base, conservative, optimistic, p90, p95]
    .flat()
    .map((point) => point.value)
    .filter(Number.isFinite);
  if (state.layers.targets) {
    financialDemo.targets.forEach((target) => {
      const plottedMaximum = Math.max(...visibleValues, 0);
      if (target.value <= plottedMaximum * 1.18) visibleValues.push(target.value);
    });
  }
  const rawMaximum = Math.max(...visibleValues, 250000) * 1.08;
  const yTicks = niceTicks(rawMaximum, 5);
  const yMaximum = yTicks.at(-1) || rawMaximum;
  const x = (age) => margin.left + ((age - minimumAge) / (maximumAge - minimumAge)) * plotWidth;
  const y = (value) => margin.top + (1 - value / yMaximum) * plotHeight;
  state.geometry = { width, height, margin, plotWidth, plotHeight, minimumAge, maximumAge, x, y };

  const colors = {
    grid: cssValue("--grid"),
    dotted: cssValue("--dotted"),
    dim: cssValue("--dim"),
    faint: cssValue("--faint"),
    surface: cssValue("--surface"),
    positive: cssValue("--positive"),
    blue: cssValue("--blue"),
    orange: cssValue("--orange"),
    purple: cssValue("--purple"),
    conservative: cssValue("--conservative"),
    optimistic: cssValue("--optimistic"),
  };

  context.font = `11px ${cssValue("--font")}`;
  context.textBaseline = "middle";
  const xTickCount = width < 500 ? 4 : 5;
  context.strokeStyle = colors.grid;
  context.fillStyle = colors.faint;
  context.lineWidth = 1;
  context.textAlign = "center";
  for (let index = 0; index < xTickCount; index += 1) {
    const age = minimumAge + ((maximumAge - minimumAge) / (xTickCount - 1)) * index;
    const px = Math.round(x(age)) + 0.5;
    context.beginPath();
    context.moveTo(px, margin.top);
    context.lineTo(px, height - margin.bottom);
    context.stroke();
    context.fillText(calendarLabel(yearAtAge(age), false), px, height - 11);
  }

  context.textAlign = "right";
  context.fillStyle = colors.dim;
  for (const value of yTicks) {
    const py = Math.round(y(value)) + 0.5;
    context.beginPath();
    context.moveTo(margin.left, py);
    context.lineTo(width - margin.right, py);
    context.stroke();
    if (!state.masked) context.fillText(formatAxisCurrency(value), margin.left - 9, py);
  }

  if (state.layers.targets) {
    context.save();
    context.setLineDash([3, 5]);
    context.lineWidth = 1;
    context.strokeStyle = "rgba(138, 180, 248, 0.58)";
    context.fillStyle = colors.blue;
    context.textAlign = "right";
    for (const target of financialDemo.targets) {
      if (target.value > yMaximum) continue;
      const py = Math.round(y(target.value)) + 0.5;
      context.beginPath();
      context.moveTo(margin.left, py);
      context.lineTo(width - margin.right, py);
      context.stroke();
      context.fillText(`${target.label} FIRE`, width - margin.right - 4, py - 8);
    }
    context.restore();
  }

  drawSeries(context, p90, x, y, colors.orange, { width: 1.2, dash: [4, 5], alpha: 0.62 });
  drawSeries(context, p95, x, y, colors.purple, { width: 1.2, dash: [4, 5], alpha: 0.62 });
  drawSeries(context, conservative, x, y, colors.conservative, { width: 1.3, dash: [3, 5], alpha: 0.8 });
  drawSeries(context, optimistic, x, y, colors.optimistic, { width: 1.3, dash: [3, 5], alpha: 0.8 });

  const areaPoints = [...history, ...base.slice(1)];
  if (state.style === "area" && areaPoints.length) {
    const rendered = decimate(areaPoints, x, y, Math.max(2, Math.round(plotWidth)));
    const gradient = context.createLinearGradient(0, margin.top, 0, height - margin.bottom);
    gradient.addColorStop(0, `rgba(${cssValue("--positive-fill")}, 0.28)`);
    gradient.addColorStop(1, `rgba(${cssValue("--positive-fill")}, 0.012)`);
    context.save();
    tracePath(context, rendered);
    context.lineTo(rendered.at(-1)[0], height - margin.bottom);
    context.lineTo(rendered[0][0], height - margin.bottom);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();
    context.restore();
  }

  drawSeries(context, history, x, y, colors.positive, { width: 1.9 });
  if (maximumAge > financialDemo.currentAge) {
    drawSeries(context, base, x, y, colors.positive, { width: 1.9, dash: [6, 4] });
  }

  const todayX = Math.round(x(financialDemo.currentAge)) + 0.5;
  if (todayX >= margin.left && todayX <= width - margin.right) {
    context.save();
    context.strokeStyle = colors.dotted;
    context.setLineDash([2, 4]);
    context.beginPath();
    context.moveTo(todayX, margin.top);
    context.lineTo(todayX, height - margin.bottom);
    context.stroke();
    context.fillStyle = colors.faint;
    context.textAlign = "left";
    context.fillText("TODAY", todayX + 6, margin.top + 10);
    context.restore();
  }

  const current = financialDemo.history.at(-1);
  context.fillStyle = colors.positive;
  context.globalAlpha = 0.24;
  context.beginPath();
  context.arc(x(current.age), y(current.value), 7, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
  context.beginPath();
  context.arc(x(current.age), y(current.value), 3.3, 0, Math.PI * 2);
  context.fill();

  if (state.hoverAge != null) drawCrosshair(context, state.hoverAge, colors);
}

function drawCrosshair(context, age, colors) {
  const { x, y, margin, height, width } = state.geometry;
  const value = portfolioValue(age);
  if (value == null) return;
  const px = Math.round(x(age)) + 0.5;
  context.save();
  context.strokeStyle = colors.dotted;
  context.lineWidth = 1;
  context.setLineDash([2, 3]);
  context.beginPath();
  context.moveTo(px, margin.top);
  context.lineTo(px, height - margin.bottom);
  context.stroke();

  const dots = [
    { value, color: colors.positive },
    state.layers.benchmarks ? { value: benchmarkValue(age, "p90"), color: colors.orange } : null,
    state.layers.benchmarks ? { value: benchmarkValue(age, "p95"), color: colors.purple } : null,
  ].filter((entry) => entry?.value != null && x(age) <= width - margin.right);
  for (const dot of dots) {
    context.fillStyle = colors.surface;
    context.beginPath();
    context.arc(px, y(dot.value), 5, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = dot.color;
    context.beginPath();
    context.arc(px, y(dot.value), 3.3, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function setSensitiveValue(element, value) {
  element.dataset.value = value;
  element.textContent = state.masked ? "••••••" : value;
  element.classList.toggle("masked", state.masked);
}

function updateHeadline(age = financialDemo.currentAge, hovering = false) {
  const value = portfolioValue(age);
  if (value == null) return;
  const baseline = financialDemo.history[0].value;
  const difference = value - baseline;
  const percentage = baseline ? (difference / baseline) * 100 : 0;
  setSensitiveValue(document.querySelector("#headline-value"), formatCurrency(value));
  document.querySelector("#headline-change").textContent = `${difference >= 0 ? "↑" : "↓"} ${Math.abs(percentage).toFixed(1)}% (${difference >= 0 ? "+" : "−"}${formatCurrency(Math.abs(difference), true)})`;
  document.querySelector("#headline-period").textContent = hovering
    ? `${calendarLabel(yearAtAge(age))} · age ${age.toFixed(1)} · since first history point`
    : "Sep 2026 · age 32.4 · Synthetic Fidelity data";
}

function updateDetails(age = financialDemo.currentAge, hovering = false) {
  const value = portfolioValue(age);
  if (value == null) return;
  document.querySelector("#detail-label").textContent = hovering ? "Hover date" : "Date";
  document.querySelector("#detail-date").textContent = calendarLabel(yearAtAge(age));
  document.querySelector("#detail-age").textContent = age.toFixed(1);
  setSensitiveValue(document.querySelector("#detail-portfolio"), formatCurrency(value));
  setSensitiveValue(document.querySelector("#detail-p90"), formatCurrency(benchmarkValue(age, "p90")));
  setSensitiveValue(document.querySelector("#detail-p95"), formatCurrency(benchmarkValue(age, "p95")));
  for (const target of financialDemo.targets) {
    const formattedTarget = formatCurrency(target.value, true);
    const progress = Math.min(999, (value / target.value) * 100);
    document.querySelector(`#${target.id}-progress`).textContent = state.masked
      ? "••••••"
      : `${formattedTarget} · ${progress.toFixed(1)}%`;
  }
}

function findTargetCrossing(targetValue) {
  return state.forecasts.base.find((point) => point.value >= targetValue) ?? null;
}

function updateArrival() {
  const medium = financialDemo.targets.find((target) => target.id === "medium");
  const crossing = findTargetCrossing(medium.value);
  document.querySelector("#medium-fire-arrival").textContent = crossing
    ? `${Math.floor(yearAtAge(crossing.age))} · age ${crossing.age.toFixed(1)}`
    : "Beyond range";
}

function updateLegend() {
  const items = [
    ["var(--positive)", "Actual"],
    ["var(--positive)", "Base forecast"],
  ];
  if (state.layers.conservative) items.push(["var(--conservative)", "Conservative"]);
  if (state.layers.optimistic) items.push(["var(--optimistic)", "Optimistic"]);
  if (state.layers.benchmarks) {
    items.push(["var(--orange)", "Top 10%"]);
    items.push(["var(--purple)", "Top 5%"]);
  }
  if (state.layers.targets) items.push(["var(--blue)", "FIRE targets"]);
  document.querySelector("#chart-legend").innerHTML = items
    .map(([color, label]) => `<span><i style="background:${color}"></i>${label}</span>`)
    .join("");
}

function tooltipRows(age) {
  const rows = [];
  if (state.layers.conservative && age >= financialDemo.currentAge) {
    rows.push(["var(--conservative)", "Conservative", portfolioValue(age, "conservative")]);
  }
  if (state.layers.optimistic && age >= financialDemo.currentAge) {
    rows.push(["var(--optimistic)", "Optimistic", portfolioValue(age, "optimistic")]);
  }
  if (state.layers.benchmarks) {
    rows.push(["var(--orange)", "Top 10%", benchmarkValue(age, "p90")]);
    rows.push(["var(--purple)", "Top 5%", benchmarkValue(age, "p95")]);
  }
  return rows.filter(([, , value]) => value != null);
}

function showTooltip(age) {
  const value = portfolioValue(age);
  if (value == null || !state.geometry) return;
  const rows = tooltipRows(age)
    .map(([color, label, rowValue]) => `<div class="tooltip-row"><i style="background:${color}"></i>${label}<b>${state.masked ? "••••••" : formatCurrency(rowValue)}</b></div>`)
    .join("");
  hoverCard.innerHTML = `
    <div class="tooltip-date">${calendarLabel(yearAtAge(age))} · age ${age.toFixed(1)}</div>
    <div class="tooltip-value">${state.masked ? "••••••" : formatCurrency(value)}</div>
    ${rows}
  `;
  hoverCard.hidden = false;
  const chartWidth = chartFrame.clientWidth;
  const tooltipWidth = Math.min(230, Math.max(176, hoverCard.offsetWidth));
  const px = state.geometry.x(age);
  const py = state.geometry.y(value) - 12;
  const constrainedX = Math.max(tooltipWidth / 2 + 4, Math.min(chartWidth - tooltipWidth / 2 - 4, px));
  hoverCard.style.left = `${constrainedX}px`;
  hoverCard.style.top = `${Math.max(70, py)}px`;
}

function ageFromPointer(clientX) {
  if (!state.geometry) return null;
  const rect = chart.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  const { margin, width, minimumAge, maximumAge } = state.geometry;
  if (pointerX < margin.left - 24 || pointerX > width - margin.right + 24) return null;
  const progress = Math.max(0, Math.min(1, (pointerX - margin.left) / (width - margin.left - margin.right)));
  return minimumAge + progress * (maximumAge - minimumAge);
}

function inspectAge(age) {
  if (age == null || portfolioValue(age) == null) return;
  state.hoverAge = age;
  drawChart();
  updateHeadline(age, true);
  updateDetails(age, true);
  showTooltip(age);
}

function resetInspection() {
  state.hoverAge = null;
  hoverCard.hidden = true;
  drawChart();
  updateHeadline();
  updateDetails();
}

function renderAll() {
  drawChart();
  updateLegend();
  updateHeadline(state.hoverAge ?? financialDemo.currentAge, state.hoverAge != null);
  updateDetails(state.hoverAge ?? financialDemo.currentAge, state.hoverAge != null);
  if (state.hoverAge != null) showTooltip(state.hoverAge);
}

function closeMenus(except = null) {
  for (const [buttonId, menuId] of [
    ["style-button", "style-menu"],
    ["compare-button", "compare-menu"],
    ["layers-button", "layers-menu"],
  ]) {
    if (menuId === except) continue;
    document.querySelector(`#${menuId}`).hidden = true;
    document.querySelector(`#${buttonId}`).setAttribute("aria-expanded", "false");
  }
}

for (const [buttonId, menuId] of [
  ["style-button", "style-menu"],
  ["compare-button", "compare-menu"],
  ["layers-button", "layers-menu"],
]) {
  const button = document.querySelector(`#${buttonId}`);
  const menu = document.querySelector(`#${menuId}`);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const opening = menu.hidden;
    closeMenus(opening ? menuId : null);
    menu.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));
  });
}

document.addEventListener("click", (event) => {
  const styleButton = event.target.closest("[data-style]");
  if (styleButton) {
    state.style = styleButton.dataset.style;
    document.querySelector("#style-label").textContent = state.style === "area" ? "Area" : "Line";
    document.querySelectorAll("[data-style]").forEach((candidate) => {
      const active = candidate === styleButton;
      candidate.setAttribute("aria-checked", String(active));
      candidate.querySelector(".tick").textContent = active ? "✓" : "";
    });
    renderAll();
    closeMenus();
    return;
  }

  const layerButton = event.target.closest("[data-layer]");
  if (layerButton) {
    const layer = layerButton.dataset.layer;
    state.layers[layer] = !state.layers[layer];
    layerButton.setAttribute("aria-checked", String(state.layers[layer]));
    layerButton.querySelector(".tick").textContent = state.layers[layer] ? "✓" : "";
    renderAll();
    return;
  }
  if (!event.target.closest(".dropdown")) closeMenus();
});

document.querySelectorAll("[data-range]").forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  button.addEventListener("click", () => {
    state.range = button.dataset.range;
    document.querySelectorAll("[data-range]").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    resetInspection();
  });
});

privacyToggle.addEventListener("click", () => {
  state.masked = !state.masked;
  privacyToggle.setAttribute("aria-pressed", String(state.masked));
  privacyToggle.textContent = state.masked ? "Show values" : "Hide values";
  document.querySelectorAll(".sensitive").forEach((element) => {
    element.textContent = state.masked ? "••••••" : element.dataset.value;
    element.classList.toggle("masked", state.masked);
  });
  renderAll();
});

chart.addEventListener("pointermove", (event) => inspectAge(ageFromPointer(event.clientX)));
chart.addEventListener("pointerdown", (event) => {
  chart.setPointerCapture(event.pointerId);
  inspectAge(ageFromPointer(event.clientX));
});
chart.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "mouse") resetInspection();
});
chart.addEventListener("pointerleave", (event) => {
  if (event.pointerType === "mouse") resetInspection();
});
chart.addEventListener("pointercancel", resetInspection);
chart.addEventListener("keydown", (event) => {
  if (!state.geometry || !["ArrowLeft", "ArrowRight", "Escape"].includes(event.key)) return;
  if (event.key === "Escape") {
    resetInspection();
    return;
  }
  event.preventDefault();
  const step = (state.geometry.maximumAge - state.geometry.minimumAge) / 60;
  const current = state.hoverAge ?? state.geometry.maximumAge;
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const age = Math.max(state.geometry.minimumAge, Math.min(state.geometry.maximumAge, current + direction * step));
  inspectAge(age);
});

let resizeTimer;
const resizeObserver = new ResizeObserver(() => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderAll, 80);
});
resizeObserver.observe(chartFrame);

async function initialize() {
  state.forecasts = Object.fromEntries(
    Object.entries(financialDemo.scenarioRates).map(([name, rate]) => [name, projectBalance(rate)]),
  );
  try {
    const response = await fetch("../data/benchmarks/financial-independence/southeast-us-men-net-worth-2024.json");
    if (!response.ok) throw new Error(`Benchmark request failed with ${response.status}`);
    state.benchmark = await response.json();
  } catch (error) {
    state.layers.benchmarks = false;
    document.querySelector('[data-layer="benchmarks"]').setAttribute("aria-checked", "false");
    document.querySelector('[data-layer="benchmarks"] .tick').textContent = "";
    console.warn("Financial benchmark unavailable", error);
  }
  updateArrival();
  renderAll();
}

initialize();
