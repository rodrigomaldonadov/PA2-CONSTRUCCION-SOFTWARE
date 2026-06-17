/**
 * ui.js - Módulo de renderizado y manipulación del DOM
 * TaskFlow - PA2 Construcción de Software
 * Autor: Abel Maldonado Vasquez
 */

/* ── Labels y emojis de categoría/prioridad ───────────────── */
const CATEGORY_LABELS = {
  trabajo:  '💼 Trabajo',
  personal: '👤 Personal',
  estudio:  '📚 Estudio',
  salud:    '💚 Salud',
};

const PRIORITY_LABELS = {
  high:   '🔴 Alta',
  medium: '🟡 Media',
  low:    '🟢 Baja',
};

const CATEGORY_COLORS = {
  trabajo:  '#6366f1',
  personal: '#22d3ee',
  estudio:  '#f59e0b',
  salud:    '#10b981',
};

/**
 * Renderiza la lista completa de tareas en el DOM.
 * @param {Array}    tasks     - Array de tareas a renderizar
 * @param {Function} onToggle  - Callback al marcar/desmarcar tarea
 * @param {Function} onEdit    - Callback al editar tarea
 * @param {Function} onDelete  - Callback al eliminar tarea
 */
export function renderTasks(tasks, { onToggle, onEdit, onDelete }) {
  const list = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  if (!list) return;

  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyState && emptyState.classList.add('visible');
    return;
  }

  emptyState && emptyState.classList.remove('visible');

  tasks.forEach(task => {
    const li = createTaskElement(task, { onToggle, onEdit, onDelete });
    list.appendChild(li);
  });
}

/**
 * Crea el elemento <li> de una tarea.
 * @param {Object}   task      - Objeto tarea
 * @param {Object}   callbacks - { onToggle, onEdit, onDelete }
 * @returns {HTMLElement}
 */
export function createTaskElement(task, { onToggle, onEdit, onDelete }) {
  const isOverdue = isTaskOverdue(task);

  const li = document.createElement('li');
  li.className = `task-item${task.completed ? ' completed' : ''}${isOverdue ? ' overdue' : ''}`;
  li.setAttribute('data-id', task.id);
  li.setAttribute('role', 'listitem');
  li.style.setProperty('--cat-color', CATEGORY_COLORS[task.category] || '#6366f1');

  // Checkbox
  const checkbox = document.createElement('button');
  checkbox.className = `task-checkbox${task.completed ? ' checked' : ''}`;
  checkbox.setAttribute('role', 'checkbox');
  checkbox.setAttribute('aria-checked', task.completed ? 'true' : 'false');
  checkbox.setAttribute('aria-label', `Marcar "${task.name}" como ${task.completed ? 'pendiente' : 'completada'}`);
  checkbox.addEventListener('click', () => onToggle(task.id));

  // Cuerpo
  const body = document.createElement('div');
  body.className = 'task-body';

  const name = document.createElement('p');
  name.className = 'task-name';
  name.textContent = task.name;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  // Badge categoría
  const catBadge = document.createElement('span');
  catBadge.className = 'badge badge-category';
  catBadge.setAttribute('data-cat', task.category);
  catBadge.textContent = CATEGORY_LABELS[task.category] || task.category;

  // Badge prioridad
  const priBadge = document.createElement('span');
  priBadge.className = 'badge badge-priority';
  priBadge.setAttribute('data-pri', task.priority);
  priBadge.textContent = PRIORITY_LABELS[task.priority] || task.priority;

  meta.appendChild(catBadge);
  meta.appendChild(priBadge);

  // Badge fecha límite
  if (task.dueDate) {
    const dueBadge = document.createElement('span');
    dueBadge.className = `badge badge-due${isOverdue ? ' overdue' : ''}`;
    dueBadge.textContent = formatDueDate(task.dueDate);
    meta.appendChild(dueBadge);
  }

  body.appendChild(name);

  // Descripción opcional
  if (task.description) {
    const desc = document.createElement('p');
    desc.className = 'task-desc';
    desc.textContent = task.description;
    body.appendChild(desc);
  }

  body.appendChild(meta);

  // Acciones
  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'task-btn edit';
  editBtn.setAttribute('aria-label', `Editar tarea: ${task.name}`);
  editBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>`;
  editBtn.addEventListener('click', () => onEdit(task.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'task-btn delete';
  delBtn.setAttribute('aria-label', `Eliminar tarea: ${task.name}`);
  delBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>`;
  delBtn.addEventListener('click', () => onDelete(task.id, li));

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
}

/**
 * Actualiza los badges de conteo en la navegación lateral.
 * @param {Array} tasks - Array completo de tareas
 */
export function updateNavBadges(tasks) {
  const pending   = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  const counts = {
    'badge-all':       tasks.length,
    'badge-pending':   pending.length,
    'badge-completed': completed.length,
    'badge-trabajo':   tasks.filter(t => t.category === 'trabajo').length,
    'badge-personal':  tasks.filter(t => t.category === 'personal').length,
    'badge-estudio':   tasks.filter(t => t.category === 'estudio').length,
    'badge-salud':     tasks.filter(t => t.category === 'salud').length,
  };

  Object.entries(counts).forEach(([id, count]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  });
}

/**
 * Actualiza las estadísticas del panel superior.
 * @param {Array} tasks - Array completo de tareas
 */
export function updateStats(tasks) {
  const today = new Date().toISOString().split('T')[0];
  const completed = tasks.filter(t => t.completed).length;
  const pending   = tasks.filter(t => !t.completed).length;
  const overdue   = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < today).length;

  setValue('stat-total-value',   tasks.length);
  setValue('stat-pending-value', pending);
  setValue('stat-done-value',    completed);
  setValue('stat-overdue-value', overdue);
  setValue('task-count-label',   `${tasks.length} ${tasks.length === 1 ? 'tarea' : 'tareas'}`);

  // Barra de progreso
  const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  const fill = document.getElementById('progress-fill');
  const pctEl = document.getElementById('progress-percent');
  const bar   = document.querySelector('.progress-bar');
  if (fill)  fill.style.width = `${pct}%`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (bar)   bar.setAttribute('aria-valuenow', pct);
}

/**
 * Muestra una notificación tipo toast.
 * @param {string} message - Mensaje a mostrar
 * @param {'success'|'error'|'info'|'warning'} type - Tipo
 * @param {number} duration - Duración en ms
 */
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error:   `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;

  const dismiss = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.addEventListener('click', dismiss);
  container.appendChild(toast);
  setTimeout(dismiss, duration);
}

/**
 * Abre el modal de edición con los datos de la tarea.
 * @param {Object} task - Tarea a editar
 */
export function openEditModal(task) {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('edit-task-id').value       = task.id;
  document.getElementById('edit-task-name').value      = task.name;
  document.getElementById('edit-task-desc').value      = task.description || '';
  document.getElementById('edit-task-category').value  = task.category;
  document.getElementById('edit-task-priority').value  = task.priority;
  document.getElementById('edit-task-due').value       = task.dueDate || '';

  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.getElementById('edit-task-name').focus();
}

/**
 * Cierra el modal de edición.
 */
export function closeEditModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
}

/**
 * Actualiza la fecha en el header.
 */
export function updateHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('es-PE', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/* ── Helpers privados ────────────────────────────────────── */

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function isTaskOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return task.dueDate < today;
}

function formatDueDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `📅 ${d} ${months[parseInt(m,10)-1]} ${y}`;
}
