
// ===================== DATA =====================
const DEFAULT_EXERCISES = [
  // Pecho
  "Press Banca","Press Inclinado","Press Declinado","Aperturas","Fondos",
  "Pec Deck","Press Mancuernas","Pullover",
  // Espalda
  "Dominadas","Jalón al Pecho","Remo con Barra","Remo con Mancuerna",
  "Remo en Polea","Peso Muerto","Rack Pull","Buenos Días","Pullover en Polea",
  // Hombros
  "Press Militar","Press Arnold","Elevaciones Laterales","Pájaro",
  "Elevaciones Frontales","Face Pull",
  // Bíceps
  "Curl con Barra","Curl con Mancuerna","Curl Martillo","Curl en Polea",
  "Curl Predicador","Curl Concentrado",
  // Tríceps
  "Press Francés","Extensión Tríceps","Triceps en Polea","Fondos Tríceps",
  "Patada de Tríceps","Skull Crusher",
  // Piernas
  "Sentadilla","Prensa","Extensión de Cuádriceps","Curl Femoral",
  "Peso Muerto Rumano","Zancadas","Sentadilla Búlgara","Hip Thrust",
  "Abducción","Aducción","Pantorrillas de Pie","Pantorrillas Sentado",
  // Core
  "Plancha","Crunchs","Oblicuos","Rodillas al Pecho","L-Sit"
];

let state = {
  program: null,
  workoutLog: {},
  prs: {},
  sessionHistory: [],
  currentWeek: 0,
  currentDay: null
};

// Load from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem('ironlog_state');
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch(e) {}
}

function saveState() {
  localStorage.setItem('ironlog_state', JSON.stringify(state));
}

// ===================== NAVIGATION =====================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const tabs = document.querySelectorAll('.nav-tab');
  const pages = ['setup','workout','prs','history'];
  tabs[pages.indexOf(page)].classList.add('active');

  if (page === 'workout') renderWorkoutPage();
  if (page === 'prs') renderPRPage();
  if (page === 'history') renderHistoryPage();
  if (page === 'setup') loadSetupFromState();
}

// ===================== SETUP =====================
let selectedDays = 0;
let dayNames = [];
let dayExercises = {}; // { dayIndex: [exercise, ...] }
let currentEditDay = null;

function selectDays(n) {
  selectedDays = n;
  document.querySelectorAll('.day-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 <= n);
  });
  dayNames = [];
  dayExercises = {};
  for (let i = 0; i < n; i++) {
    dayNames[i] = dayNames[i] || `Día ${i + 1}`;
    if (!dayExercises[i]) dayExercises[i] = [];
  }
  renderDayLabels();
  renderDayConfigs();
}

function renderDayLabels() {
  const section = document.getElementById('day-labels-section');
  const list = document.getElementById('day-labels-list');
  if (selectedDays === 0) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = '';
  for (let i = 0; i < selectedDays; i++) {
    list.innerHTML += `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--muted);min-width:60px">DÍA ${i+1}</span>
        <input type="text" placeholder="ej. Pecho, Push, Torso..." 
          value="${dayNames[i] || ''}"
          oninput="dayNames[${i}] = this.value; updateDayConfigTitle(${i}, this.value)"
          style="margin-bottom:0">
      </div>`;
  }
}

function updateDayConfigTitle(i, val) {
  const card = document.querySelector(`.day-config-card[data-day="${i}"] .day-label`);
  if (card) card.textContent = val || `Día ${i+1}`;
}

function renderDayConfigs() {
  const container = document.getElementById('day-config-container');
  if (selectedDays === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:40px"><div class="empty-icon">💪</div><div class="empty-text" style="font-size:1.2rem">Seleccioná los días primero</div></div>`;
    return;
  }
  container.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'day-config-list';
  for (let i = 0; i < selectedDays; i++) {
    const card = document.createElement('div');
    card.className = 'day-config-card';
    card.dataset.day = i;
    const exs = (dayExercises[i] || []);
    card.innerHTML = `
      <div class="day-config-header">
        <div class="day-label">${dayNames[i] || `Día ${i+1}`}</div>
        <button class="btn btn-primary" style="font-size:0.85rem;padding:8px 14px" onclick="openAddExercise(${i})">+ EJERCICIO</button>
      </div>
      <div class="day-exercises-list" id="day-ex-list-${i}">
        ${exs.length === 0 ? '<span class="empty-day">Sin ejercicios aún</span>' : exs.map(ex => `
          <div class="ex-tag">
            ${ex}
            <span class="remove" onclick="removeExercise(${i}, '${ex.replace(/'/g,"\\'")}')">✕</span>
          </div>`).join('')}
      </div>`;
    list.appendChild(card);
  }
  container.appendChild(list);
}

function removeExercise(dayIdx, exName) {
  dayExercises[dayIdx] = (dayExercises[dayIdx] || []).filter(e => e !== exName);
  renderDayConfigs();
}

function loadSetupFromState() {
  if (!state.program) return;
  const p = state.program;
  document.getElementById('program-name').value = p.name || '';
  selectedDays = p.days.length;
  dayNames = p.days.map(d => d.name);
  dayExercises = {};
  p.days.forEach((d, i) => { dayExercises[i] = [...d.exercises]; });
  document.querySelectorAll('.day-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i + 1 <= selectedDays);
  });
  renderDayLabels();
  renderDayConfigs();
}

function saveProgram() {
  if (selectedDays === 0) { showToast('⚠ Seleccioná al menos 1 día'); return; }
  const name = document.getElementById('program-name').value.trim() || 'Mi Programa';
  state.program = {
    name,
    days: Array.from({ length: selectedDays }, (_, i) => ({
      name: dayNames[i] || `Día ${i+1}`,
      exercises: dayExercises[i] || []
    }))
  };
  saveState();
  showToast('✓ PROGRAMA GUARDADO');
}

// ===================== MODAL =====================
let selectedExInModal = null;

function openAddExercise(dayIdx) {
  currentEditDay = dayIdx;
  selectedExInModal = null;
  document.getElementById('modal-day-label').textContent = dayNames[dayIdx] || `Día ${dayIdx + 1}`;
  document.getElementById('custom-ex-input').value = '';
  renderExerciseCatalog(DEFAULT_EXERCISES);
  document.getElementById('modal-add-exercise').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-add-exercise').classList.remove('open');
}

function renderExerciseCatalog(list) {
  const container = document.getElementById('exercise-catalog');
  const existing = dayExercises[currentEditDay] || [];
  container.innerHTML = list.map(ex => `
    <div class="ex-chip ${selectedExInModal === ex ? 'selected' : ''} ${existing.includes(ex) ? 'selected' : ''}"
      onclick="selectExInModal('${ex.replace(/'/g,"\\'")}', this)">${ex}</div>`).join('');
}

function filterExercises() {
  const q = document.getElementById('custom-ex-input').value.toLowerCase();
  const filtered = q ? DEFAULT_EXERCISES.filter(e => e.toLowerCase().includes(q)) : DEFAULT_EXERCISES;
  renderExerciseCatalog(filtered);
}

function selectExInModal(ex, el) {
  selectedExInModal = ex;
  document.getElementById('custom-ex-input').value = ex;
  document.querySelectorAll('.ex-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function addExerciseToDay() {
  const val = document.getElementById('custom-ex-input').value.trim() || selectedExInModal;
  if (!val) { showToast('⚠ Escribí o seleccioná un ejercicio'); return; }
  if (!dayExercises[currentEditDay]) dayExercises[currentEditDay] = [];
  if (dayExercises[currentEditDay].includes(val)) { showToast('Ya está en la lista'); return; }
  dayExercises[currentEditDay].push(val);
  renderDayConfigs();
  closeModal();
}

// ===================== WORKOUT PAGE =====================
function renderWorkoutPage() {
  const container = document.getElementById('workout-content');
  if (!state.program || !state.program.days.length) {
    container.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🏋️</div>
      <div class="empty-text">No hay programa cargado</div>
      <div class="empty-sub">Configurá tu programa primero</div>
      <button class="btn btn-ghost" onclick="showPage('setup')" style="margin-top:12px">IR A CONFIGURAR</button>
    </div>`;
    return;
  }

  const days = state.program.days;
  const week = state.currentWeek || 0;

  // Default to first non-completed day, else first
  if (state.currentDay === null || state.currentDay === undefined) {
    state.currentDay = 0;
  }

  const weekKey = `w${week}`;
  const log = state.workoutLog[weekKey] || {};

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;flex-wrap:wrap;gap:12px">
      <div>
        <div class="section-title">${state.program.name.toUpperCase().split(' ').join(' <span>').replace(/(<span>)([^<]*)$/, '<span>$2</span>')}</div>
      </div>
      ${getStreakBadge()}
    </div>
    <div class="week-nav">
      <button class="week-nav-btn" onclick="changeWeek(-1)">‹</button>
      <div class="week-counter">SEMANA ${week + 1}</div>
      <button class="week-nav-btn" onclick="changeWeek(1)">›</button>
    </div>
    <div class="week-strip">`;

  days.forEach((day, i) => {
    const dayLog = log[i] || {};
    const completed = dayLog.completed;
    html += `
      <div class="week-day-btn ${state.currentDay === i ? 'active' : ''} ${completed ? 'completed' : ''}" onclick="selectDay(${i})">
        <div class="wdb-name">${day.name}</div>
        <div class="wdb-sub">${day.exercises.length} ejs</div>
        ${completed ? '<div class="wdb-check">✓ LISTO</div>' : ''}
      </div>`;
  });

  html += `</div>`;

  const activeDay = days[state.currentDay];
  const activeDayLog = (log[state.currentDay] || {});

  html += `<div class="workout-exercises" id="workout-exercises">`;

  if (!activeDay || activeDay.exercises.length === 0) {
    html += `<div class="empty-state"><div class="empty-icon">😶</div><div class="empty-text">Sin ejercicios en este día</div></div>`;
  } else {
    activeDay.exercises.forEach((exName, eIdx) => {
      const exLog = (activeDayLog.exercises || {})[eIdx] || { sets: [{reps:'',weight:'',done:false}] };
      const pr = state.prs[exName];
      const maxReps = Math.max(...exLog.sets.filter(s=>s.done&&s.reps).map(s=>parseInt(s.reps)||0), 0);
      const isNewPR = pr && maxReps > (pr.reps || 0);

      html += `
        <div class="workout-ex-card ${exLog.sets.every(s=>s.done) && exLog.sets.length > 0 ? 'done' : ''}" id="ex-card-${eIdx}">
          <div class="ex-card-header">
            <div class="ex-name">${exName}</div>
            <div class="ex-pr-badge ${isNewPR ? 'new-pr' : ''}">
              ${pr ? `PR: ${pr.reps} reps${pr.weight ? ' @ '+pr.weight+'kg' : ''}` : 'SIN PR AÚN'}
              ${isNewPR ? ' 🔥 NUEVO PR!' : ''}
            </div>
          </div>
          <table class="sets-table">
            <thead>
              <tr>
                <th>SET</th>
                <th>REPS</th>
                <th>PESO (kg)</th>
                <th>✓</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="sets-body-${eIdx}">
              ${exLog.sets.map((set, sIdx) => renderSetRow(eIdx, sIdx, set)).join('')}
            </tbody>
          </table>
          <button class="add-set-btn" onclick="addSet(${eIdx})">+ AGREGAR SET</button>
        </div>`;
    });
  }

  html += `</div>`;

  if (activeDay && activeDay.exercises.length > 0) {
    html += `
      <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="completeDay()">MARCAR DÍA COMPLETO ✓</button>
        <button class="btn btn-ghost" onclick="resetDay()">RESETEAR DÍA</button>
      </div>`;
  }

  container.innerHTML = html;
}

function renderSetRow(eIdx, sIdx, set) {
  return `
    <tr class="set-row" id="set-row-${eIdx}-${sIdx}">
      <td class="set-num">${sIdx + 1}</td>
      <td><input class="set-input" type="number" min="0" placeholder="0" value="${set.reps || ''}"
        onchange="updateSet(${eIdx}, ${sIdx}, 'reps', this.value)"></td>
      <td><input class="set-input" type="number" min="0" step="0.5" placeholder="—" value="${set.weight || ''}"
        onchange="updateSet(${eIdx}, ${sIdx}, 'weight', this.value)"></td>
      <td>
        <div class="set-check ${set.done ? 'checked' : ''}" onclick="toggleSetDone(${eIdx}, ${sIdx})">
          ${set.done ? '✓' : ''}
        </div>
      </td>
      <td>
        <button class="remove-set-btn" onclick="removeSet(${eIdx}, ${sIdx})">✕</button>
      </td>
    </tr>`;
}

function getWeekDayLog() {
  const weekKey = `w${state.currentWeek || 0}`;
  if (!state.workoutLog[weekKey]) state.workoutLog[weekKey] = {};
  if (!state.workoutLog[weekKey][state.currentDay]) {
    state.workoutLog[weekKey][state.currentDay] = { exercises: {}, completed: false };
  }
  return state.workoutLog[weekKey][state.currentDay];
}

function getExLog(eIdx) {
  const dayLog = getWeekDayLog();
  if (!dayLog.exercises[eIdx]) {
    dayLog.exercises[eIdx] = { sets: [{ reps: '', weight: '', done: false }] };
  }
  return dayLog.exercises[eIdx];
}

function updateSet(eIdx, sIdx, field, value) {
  const exLog = getExLog(eIdx);
  exLog.sets[sIdx][field] = value;
  saveState();
}

function toggleSetDone(eIdx, sIdx) {
  const exLog = getExLog(eIdx);
  exLog.sets[sIdx].done = !exLog.sets[sIdx].done;

  // Check PR
  const exName = state.program.days[state.currentDay].exercises[eIdx];
  if (exLog.sets[sIdx].done) {
    const reps = parseInt(exLog.sets[sIdx].reps) || 0;
    const weight = parseFloat(exLog.sets[sIdx].weight) || 0;
    const pr = state.prs[exName] || {};
    if (reps > (pr.reps || 0)) {
      state.prs[exName] = { reps, weight, date: new Date().toLocaleDateString('es-AR') };
      showToast(`🏆 NUEVO PR EN ${exName.toUpperCase()}: ${reps} REPS`);
    }
  }
  saveState();
  renderWorkoutPage();
}

function addSet(eIdx) {
  const exLog = getExLog(eIdx);
  exLog.sets.push({ reps: '', weight: '', done: false });
  saveState();
  renderWorkoutPage();
}

function removeSet(eIdx, sIdx) {
  const exLog = getExLog(eIdx);
  if (exLog.sets.length <= 1) return;
  exLog.sets.splice(sIdx, 1);
  saveState();
  renderWorkoutPage();
}

function selectDay(i) {
  state.currentDay = i;
  saveState();
  renderWorkoutPage();
}

function changeWeek(dir) {
  state.currentWeek = Math.max(0, (state.currentWeek || 0) + dir);
  state.currentDay = 0;
  saveState();
  renderWorkoutPage();
}

function completeDay() {
  const dayLog = getWeekDayLog();
  dayLog.completed = true;

  // Save to history
  const date = new Date().toLocaleDateString('es-AR');
  const dayName = state.program.days[state.currentDay].name;
  const exercises = state.program.days[state.currentDay].exercises;
  state.sessionHistory.unshift({
    date,
    week: (state.currentWeek || 0) + 1,
    dayName,
    exercises
  });
  if (state.sessionHistory.length > 100) state.sessionHistory.pop();

  saveState();
  showToast('💪 ¡DÍA COMPLETADO!');
  renderWorkoutPage();
}

function resetDay() {
  const weekKey = `w${state.currentWeek || 0}`;
  if (state.workoutLog[weekKey]) {
    delete state.workoutLog[weekKey][state.currentDay];
  }
  saveState();
  renderWorkoutPage();
}

function getStreakBadge() {
  const history = state.sessionHistory;
  if (!history.length) return '';
  let streak = 0;
  const today = new Date().toLocaleDateString('es-AR');
  for (let i = 0; i < history.length; i++) {
    if (i === 0 && history[i].date === today) { streak++; continue; }
    streak++;
    if (i > 5) break;
  }
  return `<div class="streak-badge">🔥 ${streak} SESIÓN${streak !== 1 ? 'ES' : ''}</div>`;
}

// ===================== PR PAGE =====================
function renderPRPage() {
  const grid = document.getElementById('pr-grid');
  const prs = state.prs;
  const keys = Object.keys(prs);
  if (keys.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🏆</div>
      <div class="empty-text">Sin PRs registrados</div>
      <div class="empty-sub">Tus records personales aparecerán aquí cuando entrenes</div>
    </div>`;
    return;
  }
  grid.innerHTML = keys.map(ex => `
    <div class="pr-card">
      <div class="pr-ex-name">${ex}</div>
      <div class="pr-value">${prs[ex].reps}</div>
      <div class="pr-unit">repeticiones${prs[ex].weight ? ` · ${prs[ex].weight}kg` : ''}</div>
      <div class="pr-date">Logrado el ${prs[ex].date || '—'}</div>
    </div>`).join('');
}

// ===================== HISTORY PAGE =====================
function renderHistoryPage() {
  const list = document.getElementById('history-list');
  if (!state.sessionHistory.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">Sin historial</div>
      <div class="empty-sub">Tus sesiones completadas aparecerán aquí</div>
    </div>`;
    return;
  }
  list.innerHTML = state.sessionHistory.map((s, i) => `
    <div class="history-card">
      <div>
        <div class="history-date">${s.date}</div>
        <div style="font-family:var(--font-mono);font-size:0.65rem;color:var(--muted);margin-top:2px">
          SEMANA ${s.week} · ${s.dayName}
        </div>
      </div>
      <div class="history-exercises">
        ${(s.exercises || []).map(e => `<div class="history-tag">${e}</div>`).join('')}
      </div>
      <button class="btn btn-danger" onclick="deleteHistory(${i})">✕</button>
    </div>`).join('');
}

function deleteHistory(i) {
  state.sessionHistory.splice(i, 1);
  saveState();
  renderHistoryPage();
}

// ===================== TOAST =====================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===================== INIT =====================
loadState();
if (state.program) loadSetupFromState();
