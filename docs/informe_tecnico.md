# INFORME TÉCNICO — PROYECTO TASKFLOW
## Evaluación Parcial PA2: Gestión de Código con Git y GitHub

---

**DATOS DEL PROYECTO**

| Campo | Detalle |
|-------|---------|
| Proyecto | TaskFlow — Aplicación Web de Gestión de Tareas |
| Repositorio | https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE |
| Demo en vivo | https://rodrigomaldonadov.github.io/PA2-CONSTRUCCION-SOFTWARE |
| Integrante | Abel Maldonado Vasquez |
| Curso | Construcción de Software |
| Fecha | Junio 2026 |

---

## 1. DESCRIPCIÓN DEL PROYECTO

### 1.1 Problema a Resolver
En el contexto académico y profesional, la gestión eficiente de tareas es fundamental para la productividad. Muchas herramientas existentes son complejas o requieren conexión a internet. **TaskFlow** propone una solución ligera, moderna y accesible que funciona completamente en el navegador sin necesidad de servidor.

### 1.2 Objetivo del Proyecto
Desarrollar una aplicación web de gestión de tareas (To-Do List) con las siguientes características:
- CRUD completo de tareas (Crear, Leer, Actualizar, Eliminar)
- Organización por categorías (Trabajo, Personal, Estudio, Salud) y prioridades (Alta, Media, Baja)
- Búsqueda en tiempo real y filtrado de tareas
- Fechas límite con alertas de tareas vencidas
- Persistencia de datos usando LocalStorage del navegador
- Interfaz moderna con diseño dark mode y efectos glassmorphism
- Diseño completamente responsivo

### 1.3 Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| HTML5 | — | Estructura semántica |
| CSS3 | — | Estilos, animaciones, glassmorphism |
| JavaScript | ES2021 | Lógica de la aplicación |
| Jest | 29.x | Pruebas unitarias |
| ESLint | 8.x | Análisis estático de código |
| Babel | 7.x | Transpilación para tests |
| GitHub Actions | — | CI/CD automatizado |
| GitHub Pages | — | Despliegue en producción |

### 1.4 Arquitectura del Proyecto

El proyecto sigue una arquitectura modular separada en tres capas:

```
Capa de Presentación    → src/index.html + src/css/styles.css
Capa de Lógica          → src/js/app.js (controlador)
Capa de Datos           → src/js/storage.js (LocalStorage)
Capa de UI/Renderizado  → src/js/ui.js (DOM)
```

**Módulo `storage.js`** — Maneja toda la persistencia:
- `getTasks()` — Lee y parsea tareas del LocalStorage
- `saveTasks()` — Serializa y guarda el array de tareas
- `addTask()` — Agrega una nueva tarea
- `updateTask()` — Actualiza campos de una tarea por ID
- `deleteTask()` — Elimina una tarea por ID
- `clearCompleted()` — Elimina todas las tareas completadas
- `createTaskObject()` — Crea objetos tarea con estructura estándar
- `generateId()` — Genera IDs únicos basados en timestamp

**Módulo `ui.js`** — Maneja la capa visual:
- `renderTasks()` — Renderiza la lista de tareas en el DOM
- `createTaskElement()` — Crea el elemento HTML de una tarea
- `updateNavBadges()` — Actualiza contadores en la navegación
- `updateStats()` — Actualiza el panel de estadísticas
- `showToast()` — Muestra notificaciones temporales
- `openEditModal()` / `closeEditModal()` — Gestiona el modal de edición

**Módulo `app.js`** — Controlador principal:
- Orquesta los módulos `storage.js` y `ui.js`
- Gestiona el estado de la aplicación (filtro actual, búsqueda, ordenamiento)
- Registra y maneja todos los eventos del usuario
- Implementa las funciones `applyFilter()`, `applySearch()`, `applySort()`

---

## 2. USO DE GIT Y GITHUB

### 2.1 Configuración del Repositorio
El repositorio fue creado en GitHub con la URL:
`https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE.git`

La estructura inicial del repositorio incluye:
- `.gitignore` configurado para Node.js (ignora `node_modules/`, `coverage/`, etc.)
- `README.md` con badges de CI/CD, documentación completa y guías de uso
- Rama `main` como rama principal de producción

### 2.2 Convención de Commits — Conventional Commits
Se implementó la especificación **Conventional Commits** para todos los mensajes de commit. Esta convención permite generar changelogs automáticos y hace el historial comprensible.

**Formato:**
```
<tipo>(<alcance>): <descripción>
```

**Tipos utilizados:**
- `feat` — Nueva funcionalidad
- `fix` — Corrección de error
- `docs` — Cambios en documentación
- `style` — Cambios de formato (sin lógica)
- `test` — Agregar o corregir pruebas
- `ci` — Cambios en configuración CI/CD
- `chore` — Tareas de mantenimiento (versiones, etc.)

**Ejemplos de commits reales del proyecto:**
```
feat(storage): implementar CRUD completo con LocalStorage
feat(ui): agregar modal de edición con validación de formulario
feat(app): implementar filtros por categoría y estado
fix(storage): corregir error al leer localStorage con JSON inválido
test(storage): agregar suite de pruebas Jest con 8 bloques de test
ci(actions): configurar pipeline CI con lint y tests en Node 18 y 20
docs(readme): agregar sección de convención de commits y GitFlow
chore(release): bump versión a 1.0.0 en package.json
```

### 2.3 Gestión de Issues y Pull Requests
Para cada funcionalidad desarrollada se creó un Pull Request (PR) siguiendo la plantilla definida en la documentación, incluyendo:
- Descripción de los cambios
- Tipo de cambio (feat, fix, etc.)
- Lista de archivos modificados
- Confirmación de que los tests pasan
- Confirmación de que ESLint no reporta errores

---

## 3. IMPLEMENTACIÓN DE GITFLOW

### 3.1 Descripción de GitFlow
GitFlow es una estrategia de ramificación propuesta por Vincent Driessen que define un modelo robusto con ramas de larga duración (`main`, `develop`) y ramas temporales (`feature/*`, `release/*`, `hotfix/*`).

### 3.2 Ramas Implementadas

**Ramas permanentes:**

| Rama | Descripción |
|------|-------------|
| `main` | Contiene código en producción. Solo recibe merges de `release/*` y `hotfix/*`. Cada merge genera un tag de versión. |
| `develop` | Rama de integración. Recibe merges de todas las ramas `feature/*`. Aquí se integran las funcionalidades completadas. |

**Ramas de funcionalidades (feature branches):**

| Rama | Funcionalidad desarrollada |
|------|--------------------------|
| `feature/task-crud` | CRUD completo de tareas: crear, leer, actualizar, eliminar. Módulo `storage.js` y lógica principal de `app.js`. |
| `feature/ui-design` | Diseño e interfaz: dark mode, glassmorphism, animaciones CSS, diseño responsivo, sidebar y modal de edición. |
| `feature/local-storage` | Persistencia de datos: módulo `storage.js` completo con manejo de errores, generación de IDs únicos y serialización JSON. |
| `feature/filters-search` | Sistema de filtros y búsqueda: filtrado por estado (pendiente/completada), por categoría, búsqueda en tiempo real y ordenamiento. |

**Rama de release:**

| Rama | Descripción |
|------|-------------|
| `release/v1.0.0` | Preparación del primer release. Incluye ajuste de versión en `package.json`, verificación final de tests y documentación. |

**Rama de hotfix:**

| Rama | Descripción |
|------|-------------|
| `hotfix/fix-storage-bug` | Corrección de error en `storage.js`: manejo de excepciones al parsear JSON inválido de LocalStorage con try-catch. |

### 3.3 Flujo de Trabajo Seguido

```
1. Nueva funcionalidad:
   develop → feature/[nombre] → [commits] → PR → merge → develop

2. Release:
   develop → release/v1.0.0 → [ajustes] → merge → main (tag v1.0.0)
                                                  → merge → develop

3. Hotfix:
   main → hotfix/[nombre] → [fix] → merge → main (tag v1.0.1)
                                           → merge → develop
```

### 3.4 Pull Requests Creados

| PR | Origen | Destino | Descripción |
|----|--------|---------|-------------|
| #1 | `feature/ui-design` | `develop` | Diseño premium dark mode con glassmorphism |
| #2 | `feature/local-storage` | `develop` | Módulo de persistencia LocalStorage |
| #3 | `feature/task-crud` | `develop` | CRUD completo + suite de tests Jest |
| #4 | `feature/filters-search` | `develop` | Filtros, búsqueda y ordenamiento |
| #5 | `release/v1.0.0` | `main` | Release MVP v1.0.0 |
| #6 | `hotfix/fix-storage-bug` | `main` | Fix: manejo de JSON inválido |

---

## 4. AUTOMATIZACIÓN CON CI/CD

### 4.1 GitHub Actions — Pipeline CI (`ci.yml`)

El pipeline de **Integración Continua** se ejecuta automáticamente en cada `push` y `pull request` a las ramas `main`, `develop`, `feature/**`, `release/**` y `hotfix/**`.

**Pasos del pipeline:**

| Paso | Descripción |
|------|-------------|
| 📥 Checkout | Clona el código del repositorio |
| ⚙️ Setup Node.js | Configura Node.js en versión 18.x y 20.x (matriz) |
| 📦 npm ci | Instala dependencias de forma limpia |
| 🔍 ESLint | Análisis estático del código JavaScript |
| 🧪 Jest | Ejecuta la suite de pruebas con reporte de cobertura |
| 📊 Upload artifact | Sube el reporte de cobertura como artefacto |
| 🏗️ Verificar archivos | Confirma que la estructura del proyecto es correcta |

**Característica especial:** Se utiliza una **matriz de versiones** (`matrix: node-version: [18.x, 20.x]`) para garantizar compatibilidad con las dos versiones LTS activas de Node.js.

### 4.2 GitHub Actions — Pipeline CD (`deploy.yml`)

El pipeline de **Entrega Continua** se activa únicamente al hacer merge a la rama `main`. Garantiza que solo código probado y aprobado llega a producción.

**Pasos del pipeline:**

| Paso | Descripción |
|------|-------------|
| 🧪 Tests | Re-ejecuta las pruebas como gate de calidad |
| 🔍 Lint | Verifica calidad del código |
| 🏗️ Build | Copia archivos de `/src` a `/dist` |
| ⚙️ Configure Pages | Configura GitHub Pages |
| 📤 Upload artifact | Sube el directorio `/dist` como artefacto de Pages |
| 🚀 Deploy | Despliega en GitHub Pages automáticamente |

### 4.3 Beneficios de la Automatización

- **Detección temprana de errores:** Cada commit activa los tests automáticamente
- **Consistencia:** El mismo proceso de verificación se aplica en cada cambio
- **Despliegue continuo:** Los cambios aprobados llegan a producción automáticamente
- **Compatibilidad:** La matriz de Node.js garantiza que el código funciona en múltiples versiones
- **Trazabilidad:** Cada despliegue está vinculado a un commit específico

---

## 5. PRUEBAS UNITARIAS

### 5.1 Framework de Testing: Jest

Se utilizó **Jest** con el entorno `jsdom` para simular el navegador en las pruebas. Se configuró **Babel** para transpilación de módulos ES2021.

### 5.2 Suite de Pruebas

El archivo `tests/app.test.js` contiene **8 bloques de test** con **27 casos de prueba**:

| Bloque | Función/Módulo | Casos | Descripción |
|--------|---------------|-------|-------------|
| 1 | `generateId()` | 3 | ID con prefijo, unicidad, tipo string |
| 2 | `createTaskObject()` | 3 | Campos requeridos, recorte de espacios, valores custom |
| 3 | `getTasks()` / `saveTasks()` | 3 | Array vacío, persistencia, retorno boolean |
| 4 | `addTask()` | 3 | Agregar tarea, múltiples tareas, persistencia |
| 5 | `updateTask()` | 4 | Actualizar completed, name, updatedAt, no afectar otras |
| 6 | `deleteTask()` | 3 | Eliminar por ID, no afectar otras, ID inexistente |
| 7 | `clearCompleted()` | 3 | Eliminar completadas, no afectar pendientes, array vacío |
| 8 | Lógica de filtros | 5 | Filtros all, pending, completed, cat-trabajo, cat-estudio |

### 5.3 Cobertura de Código

El umbral de cobertura mínima configurado en `package.json`:
- Statements: 60%
- Branches: 60%
- Functions: 60%
- Lines: 60%

---

## 6. MANEJO DE CONFLICTOS

### 6.1 ¿Qué es un Conflicto de Fusión?
Un conflicto de merge ocurre cuando dos ramas modifican las mismas líneas del mismo archivo y Git no puede determinar automáticamente cuál versión conservar.

### 6.2 Ejemplo Práctico — Conflicto Simulado

Durante el desarrollo, se simuló un conflicto entre `feature/local-storage` y `feature/task-crud` al modificar ambas ramas el archivo `src/js/storage.js`.

**Situación:**
- `feature/local-storage` agregó manejo de errores con try-catch en `getTasks()`
- `feature/task-crud` modificó el valor de retorno de `getTasks()` para incluir validación

**Git marcó el conflicto:**
```
<<<<<<< HEAD (feature/local-storage)
export function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('[TaskFlow] Error al leer tareas del storage:', error);
    return [];
  }
}
=======
export function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw).filter(t => t && t.id);
}
>>>>>>> feature/task-crud
```

**Resolución:** Se combinaron ambas soluciones — manteniendo el try-catch de `feature/local-storage` y agregando el filtro de validación de `feature/task-crud`:

```javascript
export function getTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).filter(t => t && t.id) : [];
  } catch (error) {
    console.error('[TaskFlow] Error al leer tareas del storage:', error);
    return [];
  }
}
```

**Commit de resolución:**
```bash
git commit -m "fix(merge): resolver conflicto en storage.js — combinar try-catch con filtro de validación"
```

### 6.3 Estrategias de Prevención Implementadas
- **Ramas feature de vida corta:** Máximo 2-3 días para minimizar divergencia
- **Pull frecuente de develop:** Antes de iniciar trabajo en la rama local
- **Code reviews en PRs:** Revisar cambios antes del merge
- **Tests como gate:** Solo se fusiona código con tests en verde

---

## 7. BUENAS PRÁCTICAS IMPLEMENTADAS

### 7.1 Control de Versiones
- Commits atómicos: cada commit representa un cambio lógico único
- Mensajes descriptivos siguiendo Conventional Commits
- Historial limpio con merge commits explícitos (`--no-ff`)
- Tags semánticos para cada release (`v1.0.0`, `v1.0.1`)

### 7.2 Calidad del Código
- ESLint con reglas consistentes (semicolons, comillas simples, indentación)
- Funciones con responsabilidad única (Single Responsibility Principle)
- Módulos separados por capa (storage, ui, app)
- Comentarios JSDoc en todas las funciones públicas

### 7.3 Seguridad y Robustez
- Manejo de errores con try-catch en operaciones de LocalStorage
- Validación de entradas en formularios (trim, verificación de vacío)
- IDs únicos con combinación de timestamp y número aleatorio
- Sanitización implícita al usar `textContent` en lugar de `innerHTML`

### 7.4 Accesibilidad
- Atributos `aria-label`, `aria-hidden`, `role` en todos los elementos interactivos
- Clase `.sr-only` para etiquetas de formulario accesibles pero no visibles
- Navegación completa por teclado (Escape cierra modales)
- Regiones semánticas (`<main>`, `<aside>`, `<nav>`, `<header>`)

---

## 8. CONCLUSIONES

El desarrollo de **TaskFlow** permitió aplicar de manera práctica los conceptos fundamentales de gestión de código con Git y GitHub:

1. **GitFlow** demostró ser una estrategia efectiva para organizar el trabajo en ramas claramente definidas, facilitando la integración de funcionalidades de forma ordenada y segura.

2. **GitHub Actions** automatizó el proceso de verificación de calidad, eliminando la posibilidad de subir código con errores de lint o tests fallidos a las ramas principales.

3. **Conventional Commits** hizo el historial de cambios comprensible y permitirá en el futuro generar changelogs automáticos.

4. La separación en módulos (`storage.js`, `ui.js`, `app.js`) facilitó el testing unitario y demostró la importancia del principio de responsabilidad única.

5. El manejo de conflictos, aunque simulado en este proyecto individual, demostró la importancia de comunicación y estrategias de prevención en equipos reales.

---

## 9. REFERENCIAS

- Driessen, V. (2010). *A successful Git branching model*. https://nvie.com/posts/a-successful-git-branching-model/
- Conventional Commits. (2024). *Conventional Commits Specification v1.0.0*. https://www.conventionalcommits.org/
- GitHub. (2024). *GitHub Actions Documentation*. https://docs.github.com/en/actions
- Jest. (2024). *Jest Documentation*. https://jestjs.io/docs/getting-started
- ESLint. (2024). *ESLint Documentation*. https://eslint.org/docs/latest/
