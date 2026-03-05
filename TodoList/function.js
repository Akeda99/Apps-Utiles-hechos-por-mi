
  // ── State ──────────────────────────────────────────────
  const STORAGE_KEY = "pendientes-v1";
  let data = {};       // { "2025-03-05": [ {id, text, done}, ... ] }
  let selectedDay = todayStr();

  // ── Helpers ────────────────────────────────────────────
  function todayStr() {
    const n = new Date();
    return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())}`;
  }
  function pad(n) { return String(n).padStart(2,"0"); }
  function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

  const DAYS_ES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  const MONTHS_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];

  function formatDate(str) {
    const [y,m,d] = str.split("-").map(Number);
    const date = new Date(y, m-1, d);
    return `${DAYS_ES[date.getDay()]}, ${d} de ${MONTHS_ES[m-1]}`;
  }
  function shortDate(str) {
    return str.slice(5).replace("-","/");
  }

  // ── Persistence ────────────────────────────────────────
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) data = JSON.parse(raw);
    } catch(e) { data = {}; }
  }

  let saveTimer;
  function save() {
    const el = document.getElementById("save-status");
    el.textContent = "guardando…";
    el.classList.add("saving");
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch(e) {}
      el.textContent = "guardado ✓";
      el.classList.remove("saving");
    }, 400);
  }

  // ── Render sidebar ─────────────────────────────────────
  function renderSidebar() {
    const today = todayStr();
    const keys = Object.keys(data).sort((a,b) => b.localeCompare(a));
    if (!keys.includes(today)) keys.unshift(today);

    const container = document.getElementById("day-list");
    container.innerHTML = "";

    keys.forEach(day => {
      const tasks = data[day] || [];
      const done  = tasks.filter(t => t.done).length;
      const isToday = day === today;

      const btn = document.createElement("button");
      btn.className = "day-btn" + (day === selectedDay ? " active" : "") + (tasks.length && done === tasks.length ? " all-done" : "");
      btn.dataset.day = day;

      const keySpan = document.createElement("span");
      keySpan.className = "day-key";
      keySpan.textContent = isToday ? "hoy •" : shortDate(day);
      btn.appendChild(keySpan);

      if (tasks.length > 0) {
        const prog = document.createElement("span");
        prog.className = "day-progress";
        prog.textContent = `${done}/${tasks.length} listo`;
        btn.appendChild(prog);
      }

      btn.addEventListener("click", () => {
        selectedDay = day;
        closeSidebarOnMobile();
        render();
      });

      container.appendChild(btn);
    });
  }

  // ── Render main ────────────────────────────────────────
  function renderMain() {
    const tasks = data[selectedDay] || [];
    const done  = tasks.filter(t => t.done).length;
    const total = tasks.length;

    // Title
    document.getElementById("day-title").textContent = formatDate(selectedDay);
    // Update mobile toggle label
    const lbl = document.getElementById("toggle-day-label");
    if (lbl) lbl.textContent = selectedDay === todayStr() ? "hoy" : shortDate(selectedDay);

    // Progress
    const wrap = document.getElementById("progress-wrap");
    if (total > 0) {
      wrap.style.display = "flex";
      const fill = document.getElementById("progress-fill");
      fill.style.width = `${(done/total)*100}%`;
      fill.className = "progress-bar-fill" + (done === total ? " complete" : "");
      document.getElementById("progress-text").textContent = `${done} de ${total}`;
    } else {
      wrap.style.display = "none";
    }

    // Task list
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if (tasks.length === 0) {
      const msg = document.createElement("div");
      msg.className = "empty-msg";
      msg.textContent = "nada por aquí todavía";
      list.appendChild(msg);
    } else {
      tasks.forEach((task, i) => {
        const item = document.createElement("div");
        item.className = "task-item" + (task.done ? " done" : "");
        item.style.animationDelay = `${i * 0.04}s`;

        // Checkbox
        const check = document.createElement("button");
        check.className = "task-check" + (task.done ? " checked" : "");
        check.innerHTML = `<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
        check.addEventListener("click", () => toggleTask(task.id));

        // Text
        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = task.text;
        text.addEventListener("click", () => toggleTask(task.id));

        // Delete
        const del = document.createElement("button");
        del.className = "task-delete";
        del.textContent = "×";
        del.title = "Eliminar";
        del.addEventListener("click", () => deleteTask(task.id));

        item.appendChild(check);
        item.appendChild(text);
        item.appendChild(del);
        list.appendChild(item);
      });
    }

    // Clear done button
    const clearBtn = document.getElementById("clear-done");
    if (done > 0) {
      clearBtn.style.display = "block";
      clearBtn.textContent = `limpiar completados (${done})`;
    } else {
      clearBtn.style.display = "none";
    }
  }

  function render() {
    renderSidebar();
    renderMain();
  }

  // ── Actions ────────────────────────────────────────────
  function addTask() {
    const input = document.getElementById("new-task");
    const text = input.value.trim();
    if (!text) return;

    if (!data[selectedDay]) data[selectedDay] = [];
    data[selectedDay].push({ id: uid(), text, done: false });

    input.value = "";
    input.focus();
    save();
    render();
  }

  function toggleTask(id) {
    const tasks = data[selectedDay] || [];
    const task = tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    save();
    render();
  }

  function deleteTask(id) {
    if (!data[selectedDay]) return;
    data[selectedDay] = data[selectedDay].filter(t => t.id !== id);
    save();
    render();
  }

  function clearDone() {
    if (!data[selectedDay]) return;
    data[selectedDay] = data[selectedDay].filter(t => !t.done);
    save();
    render();
  }

  // ── Events ─────────────────────────────────────────────
  document.getElementById("add-btn").addEventListener("click", addTask);
  document.getElementById("new-task").addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
  });
  document.getElementById("clear-done").addEventListener("click", clearDone);
  document.getElementById("goto-date").addEventListener("change", function() {
    if (this.value) {
      selectedDay = this.value;
      this.value = "";
      closeSidebarOnMobile();
      render();
    }
  });

  // ── Mobile sidebar toggle ──────────────────────────────
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar   = document.getElementById("sidebar");
  toggleBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    toggleBtn.classList.toggle("open", isOpen);
  });
  // Close sidebar when a day is picked on mobile
  function closeSidebarOnMobile() {
    if (window.innerWidth <= 600) {
      sidebar.classList.remove("open");
      toggleBtn.classList.remove("open");
    }
  }

  // ── Init ───────────────────────────────────────────────
  load();
  render();
