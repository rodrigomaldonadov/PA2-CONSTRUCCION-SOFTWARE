/**
 * app.test.js - Suite de pruebas unitarias para TaskFlow
 * PA2 Construcción de Software
 * Autor: Abel Maldonado Vasquez
 *
 * Prueba los módulos: storage.js (lógica de datos)
 * y las funciones de filtrado/ordenamiento de app.js
 */

// ── Mock de localStorage ──────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key) => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear:      () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ── Importar módulos ──────────────────────────────────────
const {
  getTasks, saveTasks, addTask, updateTask,
  deleteTask, clearCompleted, generateId, createTaskObject,
} = require('../src/js/storage.js');

// ── Helpers de test ───────────────────────────────────────
function makeTask(overrides = {}) {
  return {
    id:          generateId(),
    name:        'Tarea de prueba',
    description: '',
    category:    'trabajo',
    priority:    'medium',
    dueDate:     '',
    completed:   false,
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
    ...overrides,
  };
}

/* ============================================================
   BLOQUE 1: generateId()
   ============================================================ */
describe('generateId()', () => {
  test('debe generar un ID con el prefijo "task_"', () => {
    const id = generateId();
    expect(id).toMatch(/^task_/);
  });

  test('debe generar IDs únicos en llamadas consecutivas', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });

  test('el ID debe ser una cadena de texto', () => {
    expect(typeof generateId()).toBe('string');
  });
});

/* ============================================================
   BLOQUE 2: createTaskObject()
   ============================================================ */
describe('createTaskObject()', () => {
  test('crea un objeto tarea con todos los campos requeridos', () => {
    const task = createTaskObject({ name: 'Mi tarea' });
    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('name', 'Mi tarea');
    expect(task).toHaveProperty('category', 'trabajo');
    expect(task).toHaveProperty('priority', 'medium');
    expect(task).toHaveProperty('completed', false);
    expect(task).toHaveProperty('createdAt');
    expect(task).toHaveProperty('updatedAt');
  });

  test('recorta espacios en blanco del nombre', () => {
    const task = createTaskObject({ name: '  Tarea con espacios  ' });
    expect(task.name).toBe('Tarea con espacios');
  });

  test('usa los valores personalizados correctamente', () => {
    const task = createTaskObject({
      name:     'Estudiar Git',
      category: 'estudio',
      priority: 'high',
      dueDate:  '2026-07-01',
    });
    expect(task.category).toBe('estudio');
    expect(task.priority).toBe('high');
    expect(task.dueDate).toBe('2026-07-01');
  });
});

/* ============================================================
   BLOQUE 3: getTasks() y saveTasks()
   ============================================================ */
describe('getTasks() / saveTasks()', () => {
  beforeEach(() => localStorage.clear());

  test('devuelve un array vacío si no hay tareas guardadas', () => {
    expect(getTasks()).toEqual([]);
  });

  test('saveTasks() persiste datos y getTasks() los recupera', () => {
    const tasks = [makeTask({ name: 'Tarea A' }), makeTask({ name: 'Tarea B' })];
    saveTasks(tasks);
    const result = getTasks();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Tarea A');
  });

  test('saveTasks() retorna true al guardar correctamente', () => {
    expect(saveTasks([])).toBe(true);
  });
});

/* ============================================================
   BLOQUE 4: addTask()
   ============================================================ */
describe('addTask()', () => {
  beforeEach(() => localStorage.clear());

  test('agrega una tarea y devuelve el array actualizado', () => {
    const task   = makeTask({ name: 'Primera tarea' });
    const result = addTask(task);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Primera tarea');
  });

  test('agrega múltiples tareas secuencialmente', () => {
    addTask(makeTask({ name: 'Tarea 1' }));
    addTask(makeTask({ name: 'Tarea 2' }));
    const result = addTask(makeTask({ name: 'Tarea 3' }));
    expect(result).toHaveLength(3);
  });

  test('las tareas persisten en localStorage', () => {
    addTask(makeTask({ name: 'Persistente' }));
    // Simular nueva lectura del storage
    expect(getTasks()).toHaveLength(1);
  });
});

/* ============================================================
   BLOQUE 5: updateTask()
   ============================================================ */
describe('updateTask()', () => {
  let task;

  beforeEach(() => {
    localStorage.clear();
    task = makeTask({ name: 'Original', completed: false });
    addTask(task);
  });

  test('actualiza el campo "completed"', () => {
    updateTask(task.id, { completed: true });
    const updated = getTasks().find(t => t.id === task.id);
    expect(updated.completed).toBe(true);
  });

  test('actualiza el campo "name"', () => {
    updateTask(task.id, { name: 'Nombre actualizado' });
    const updated = getTasks().find(t => t.id === task.id);
    expect(updated.name).toBe('Nombre actualizado');
  });

  test('actualiza el campo "updatedAt"', () => {
    const original = task.updatedAt;
    // Esperar un milisegundo para garantizar diferencia de timestamp
    return new Promise(resolve => setTimeout(() => {
      updateTask(task.id, { name: 'Nuevo nombre' });
      const updated = getTasks().find(t => t.id === task.id);
      expect(updated.updatedAt).not.toBe(original);
      resolve();
    }, 5));
  });

  test('no modifica otras tareas', () => {
    const other = makeTask({ name: 'Otra tarea' });
    addTask(other);
    updateTask(task.id, { completed: true });
    const otherAfter = getTasks().find(t => t.id === other.id);
    expect(otherAfter.completed).toBe(false);
  });

  test('ID no encontrado no lanza error y devuelve el array sin cambios', () => {
    const before = getTasks();
    const result = updateTask('id_inexistente', { name: 'X' });
    expect(result).toHaveLength(before.length);
  });
});

/* ============================================================
   BLOQUE 6: deleteTask()
   ============================================================ */
describe('deleteTask()', () => {
  beforeEach(() => localStorage.clear());

  test('elimina una tarea por ID', () => {
    const task = makeTask({ name: 'A eliminar' });
    addTask(task);
    deleteTask(task.id);
    expect(getTasks()).toHaveLength(0);
  });

  test('no elimina otras tareas', () => {
    const t1 = makeTask({ name: 'Queda' });
    const t2 = makeTask({ name: 'Se va' });
    addTask(t1); addTask(t2);
    deleteTask(t2.id);
    const remaining = getTasks();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('Queda');
  });

  test('eliminar ID inexistente no lanza error', () => {
    addTask(makeTask());
    expect(() => deleteTask('id_falso')).not.toThrow();
    expect(getTasks()).toHaveLength(1);
  });
});

/* ============================================================
   BLOQUE 7: clearCompleted()
   ============================================================ */
describe('clearCompleted()', () => {
  beforeEach(() => localStorage.clear());

  test('elimina solo las tareas completadas', () => {
    addTask(makeTask({ name: 'Pendiente',  completed: false }));
    addTask(makeTask({ name: 'Completada', completed: true  }));
    clearCompleted();
    const remaining = getTasks();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('Pendiente');
  });

  test('no hace nada si no hay tareas completadas', () => {
    addTask(makeTask({ completed: false }));
    clearCompleted();
    expect(getTasks()).toHaveLength(1);
  });

  test('devuelve array vacío si todas estaban completadas', () => {
    addTask(makeTask({ completed: true }));
    addTask(makeTask({ completed: true }));
    const result = clearCompleted();
    expect(result).toHaveLength(0);
  });
});

/* ============================================================
   BLOQUE 8: Filtros de applyFilter (lógica pura)
   ============================================================ */
describe('Lógica de filtros', () => {
  const tasks = [
    makeTask({ name: 'T1', completed: false, category: 'trabajo'  }),
    makeTask({ name: 'T2', completed: true,  category: 'estudio'  }),
    makeTask({ name: 'T3', completed: false, category: 'personal' }),
    makeTask({ name: 'T4', completed: true,  category: 'salud'    }),
  ];

  function applyFilter(tasks, filter) {
    switch (filter) {
    case 'pending':      return tasks.filter(t => !t.completed);
    case 'completed':    return tasks.filter(t => t.completed);
    case 'cat-trabajo':  return tasks.filter(t => t.category === 'trabajo');
    case 'cat-personal': return tasks.filter(t => t.category === 'personal');
    case 'cat-estudio':  return tasks.filter(t => t.category === 'estudio');
    case 'cat-salud':    return tasks.filter(t => t.category === 'salud');
    default:             return tasks;
    }
  }

  test('filter "all" devuelve todas las tareas', () => {
    expect(applyFilter(tasks, 'all')).toHaveLength(4);
  });

  test('filter "pending" devuelve solo tareas no completadas', () => {
    const result = applyFilter(tasks, 'pending');
    expect(result).toHaveLength(2);
    result.forEach(t => expect(t.completed).toBe(false));
  });

  test('filter "completed" devuelve solo tareas completadas', () => {
    const result = applyFilter(tasks, 'completed');
    expect(result).toHaveLength(2);
    result.forEach(t => expect(t.completed).toBe(true));
  });

  test('filter "cat-trabajo" devuelve solo tareas de categoría Trabajo', () => {
    const result = applyFilter(tasks, 'cat-trabajo');
    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('trabajo');
  });

  test('filter "cat-estudio" devuelve solo tareas de categoría Estudio', () => {
    const result = applyFilter(tasks, 'cat-estudio');
    expect(result[0].category).toBe('estudio');
  });
});
