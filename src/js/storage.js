/**
 * storage.js - Módulo de persistencia con LocalStorage
 * TaskFlow - PA2 Construcción de Software
 * Autor: Abel Maldonado Vasquez
 */

const STORAGE_KEY = 'taskflow_tasks';

/**
 * Obtiene todas las tareas almacenadas en LocalStorage.
 * @returns {Array} Array de objetos tarea
 */
export function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('[TaskFlow] Error al leer tareas del storage:', error);
    return [];
  }
}

/**
 * Guarda el array completo de tareas en LocalStorage.
 * @param {Array} tasks - Array de objetos tarea
 * @returns {boolean} true si se guardó correctamente
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('[TaskFlow] Error al guardar tareas:', error);
    return false;
  }
}

/**
 * Agrega una nueva tarea al storage.
 * @param {Object} task - Objeto tarea a agregar
 * @returns {Array} Array actualizado de tareas
 */
export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  return tasks;
}

/**
 * Actualiza una tarea existente por su ID.
 * @param {string} id - ID único de la tarea
 * @param {Object} updates - Campos a actualizar
 * @returns {Array} Array actualizado de tareas
 */
export function updateTask(id, updates) {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    console.warn(`[TaskFlow] Tarea con ID "${id}" no encontrada.`);
    return tasks;
  }
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  saveTasks(tasks);
  return tasks;
}

/**
 * Elimina una tarea por su ID.
 * @param {string} id - ID único de la tarea
 * @returns {Array} Array actualizado de tareas
 */
export function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  return tasks;
}

/**
 * Elimina todas las tareas completadas.
 * @returns {Array} Array actualizado de tareas
 */
export function clearCompleted() {
  const tasks = getTasks().filter(t => !t.completed);
  saveTasks(tasks);
  return tasks;
}

/**
 * Genera un ID único para cada tarea.
 * @returns {string} ID único basado en timestamp + random
 */
export function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea un objeto tarea con valores por defecto.
 * @param {Object} params - Parámetros de la tarea
 * @returns {Object} Objeto tarea completo
 */
export function createTaskObject({ name, category = 'trabajo', priority = 'medium', dueDate = '', description = '' }) {
  return {
    id: generateId(),
    name: name.trim(),
    description: description.trim(),
    category,
    priority,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
