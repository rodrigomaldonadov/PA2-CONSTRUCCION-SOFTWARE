/**
 * app.js - Controlador principal de TaskFlow
 * PA2 Construcción de Software
 * Autor: Abel Maldonado Vasquez
 *
 * Orquesta la interacción entre los módulos storage.js y ui.js,
 * gestiona eventos del usuario y aplica filtros/ordenamiento.
 */

import {
  getTasks, addTask, updateTask, deleteTask,
  clearCompleted, createTaskObject,
} from './storage.js';

import {
  renderTasks, updateNavBadges, updateStats,
  showToast, openEditModal, closeEditModal, updateHeaderDate,
} from './ui.js';

/* ── Estado de la aplicación ─────────────────────────────── */
let currentFilter = 'all';
let currentSearch = '';
let currentSort   = 'date-desc';

/* ── Inicialización ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderDate();
  initEventListeners();
  refresh();
  setDefaultDueDate();
});

/**
 * Refresca la interfaz: filtra, ordena y renderiza las tareas.
 */
function refresh() {
  const allTasks = getTasks();
  const filtered = applyFilter(allTasks, currentFilter);
  const searched = applySearch(filtered, currentSearch);
  const sorted   = applySort(searched, currentSort);

  renderTasks(sorted, {
    onToggle: handleToggle,
    onEdit:   handleEditOpen,
    onDelete: handleDelete,
  });

  updateNavBadges(allTasks);
  updateStats(allTasks);
}

/* ── Filtrado, Búsqueda y Ordenamiento ───────────────────── */

function applyFilter(tasks, filter) {
  switch (filter) {
  case 'pending':   return tasks.filter(t => !t.completed);
  case 'completed': return tasks.filter(t => t.completed);
  case 'cat-trabajo':  return tasks.filter(t => t.category === 'trabajo');
  case 'cat-personal': return tasks.filter(t => t.category === 'personal');
  case 'cat-estudio':  return tasks.filter(t => t.category === 'estudio');
  case 'cat-salud':    return tasks.filter(t => t.category === 'salud');
  default:          return tasks;
  }
}

function applySearch(tasks, query) {
  if (!query.trim()) return tasks;
  const q = query.toLowerCase();
  return tasks.filter(t =>
    t.name.toLowerCase().includes(q) ||
    (t.description && t.description.toLowerCase().includes(q))
  );
}

function applySort(tasks, sort) {
  const arr = [...tasks];
  switch (sort) {
  case 'date-asc':  return arr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  case 'date-desc': return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  case 'priority': {
    const order = { high: 0, medium: 1, low: 2 };
    return arr.sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1));
  }
  case 'alpha': return arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  default:      return arr;
  }
}

/* ── Manejadores de eventos ──────────────────────────────── */

function handleAddTask(e) {
  e.preventDefault();
  const nameInput = document.getElementById('task-input');
  const name = nameInput.value.trim();

  if (!name) {
    showToast('El nombre de la tarea no puede estar vacío.', 'warning');
    nameInput.focus();
    return;
  }

  const task = createTaskObject({
    name,
    category:    document.getElementById('task-category').value,
    priority:    document.getElementById('task-priority').value,
    dueDate:     document.getElementById('task-due-date').value,
    description: '',
  });

  addTask(task);
  nameInput.value = '';
  nameInput.focus();
  refresh();
  showToast(`Tarea "${truncate(name, 30)}" agregada correctamente.`, 'success');
}

function handleToggle(id) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  const completed = !task.completed;
  updateTask(id, { completed });
  refresh();

  showToast(
    completed
      ? `✅ Tarea completada: "${truncate(task.name, 30)}"`
      : `🔄 Tarea marcada como pendiente.`,
    completed ? 'success' : 'info'
  );
}

function handleDelete(id, li) {
  const tasks = getTasks();
  const task  = tasks.find(t => t.id === id);
  if (!task) return;

  // Animación de salida antes de eliminar
  if (li) {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      deleteTask(id);
      refresh();
    }, { once: true });
  } else {
    deleteTask(id);
    refresh();
  }

  showToast(`Tarea "${truncate(task.name, 30)}" eliminada.`, 'info');
}

function handleEditOpen(id) {
  const task = getTasks().find(t => t.id === id);
  if (!task) return;
  openEditModal(task);
}

function handleEditSave(e) {
  e.preventDefault();
  const id   = document.getElementById('edit-task-id').value;
  const name = document.getElementById('edit-task-name').value.trim();

  if (!name) {
    showToast('El nombre no puede estar vacío.', 'warning');
    return;
  }

  updateTask(id, {
    name,
    description: document.getElementById('edit-task-desc').value.trim(),
    category:    document.getElementById('edit-task-category').value,
    priority:    document.getElementById('edit-task-priority').value,
    dueDate:     document.getElementById('edit-task-due').value,
  });

  closeEditModal();
  refresh();
  showToast('Tarea actualizada correctamente.', 'success');
}

function handleClearCompleted() {
  const tasks = getTasks();
  const count = tasks.filter(t => t.completed).length;

  if (count === 0) {
    showToast('No hay tareas completadas para eliminar.', 'info');
    return;
  }

  clearCompleted();
  refresh();
  showToast(`${count} ${count === 1 ? 'tarea eliminada' : 'tareas eliminadas'}.`, 'info');
}

function handleNavFilter(filter) {
  currentFilter = filter;

  // Actualizar estado activo en nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });

  const active = document.querySelector(`[data-filter="${filter}"]`);
  if (active) {
    active.classList.add('active');
    active.setAttribute('aria-current', 'true');
  }

  // Actualizar título de página
  const TITLES = {
    all:          'Todas las tareas',
    pending:      'Tareas Pendientes',
    completed:    'Tareas Completadas',
    'cat-trabajo':  'Categoría: Trabajo',
    'cat-personal': 'Categoría: Personal',
    'cat-estudio':  'Categoría: Estudio',
    'cat-salud':    'Categoría: Salud',
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = TITLES[filter] || 'Tareas';

  refresh();
}

function handleSidebarToggle() {
  const sidebar     = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const isMobile    = window.innerWidth <= 900;

  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');
  }
}

/* ── Registro de eventos ─────────────────────────────────── */
function initEventListeners() {
  // Formulario agregar tarea
  document.getElementById('quick-add-form')
    ?.addEventListener('submit', handleAddTask);

  // Formulario editar tarea
  document.getElementById('edit-form')
    ?.addEventListener('submit', handleEditSave);

  // Cerrar modal
  document.getElementById('modal-close')
    ?.addEventListener('click', closeEditModal);
  document.getElementById('modal-cancel')
    ?.addEventListener('click', closeEditModal);
  document.getElementById('modal-overlay')
    ?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeEditModal();
    });

  // Escape cierra modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEditModal();
  });

  // Limpiar completadas
  document.getElementById('clear-completed-btn')
    ?.addEventListener('click', handleClearCompleted);

  // Barra de búsqueda
  document.getElementById('search-input')
    ?.addEventListener('input', e => {
      currentSearch = e.target.value;
      refresh();
    });

  // Ordenamiento
  document.getElementById('sort-select')
    ?.addEventListener('change', e => {
      currentSort = e.target.value;
      refresh();
    });

  // Navegación lateral (filtros)
  document.querySelectorAll('.nav-item[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => handleNavFilter(btn.dataset.filter));
  });

  // Toggle sidebar
  document.getElementById('sidebar-toggle')
    ?.addEventListener('click', handleSidebarToggle);
  document.getElementById('menu-btn')
    ?.addEventListener('click', handleSidebarToggle);
}

/* ── Helpers ─────────────────────────────────────────────── */

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function setDefaultDueDate() {
  const dueDateInput = document.getElementById('task-due-date');
  if (dueDateInput) {
    dueDateInput.min = new Date().toISOString().split('T')[0];
  }
}

// Exportar para pruebas
export { applyFilter, applySearch, applySort };
