<div align="center">

# TaskFlow ✅
### Aplicación Web de Gestión de Tareas

![CI](https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE/actions/workflows/deploy.yml/badge.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen?logo=github)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2021-yellow?logo=javascript)

**PA2 - Producto Académico 2 | Construcción de Software**

[🌐 Ver Demo](https://rodrigomaldonadov.github.io/PA2-CONSTRUCCION-SOFTWARE) • [📋 Issues](https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE/issues) • [📖 Wiki](https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE/wiki)

</div>

---

## 📌 Descripción

**TaskFlow** es una aplicación web moderna para la gestión de tareas personales y profesionales, desarrollada con HTML5, CSS3 y JavaScript ES2021. El proyecto implementa control de versiones con Git y GitHub siguiendo el flujo de trabajo **GitFlow**, con automatización de CI/CD mediante **GitHub Actions**.

### ✨ Características

- ✅ **CRUD completo** — Crear, leer, actualizar y eliminar tareas
- 🎯 **Prioridades** — Alta, media y baja con indicadores visuales
- 🏷️ **Categorías** — Trabajo, Personal, Estudio y Salud
- 🔍 **Búsqueda en tiempo real** — Filtrado instantáneo por nombre o descripción
- 📅 **Fechas límite** — Con alertas de tareas vencidas
- 📊 **Panel de estadísticas** — Contador de tareas y barra de progreso
- 💾 **Persistencia** — Datos guardados en LocalStorage (sin servidor)
- 📱 **Responsivo** — Diseño adaptable a cualquier dispositivo
- 🌙 **Dark Mode** — Interfaz oscura con efectos glassmorphism

---

## 🚀 Instalación y Uso

### Prerequisitos
- Node.js 18+ y npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE.git
cd PA2-CONSTRUCCION-SOFTWARE

# 2. Instalar dependencias de desarrollo
npm install

# 3. Ejecutar pruebas
npm test

# 4. Verificar calidad del código
npm run lint

# 5. Abrir la aplicación
# Abre src/index.html en tu navegador
```

---

## 🌿 Estructura de Ramas (GitFlow)

Este proyecto implementa **GitFlow** como estrategia de ramificación:

```
main ─────────────────────────────────────────────── (producción)
  │
  └── develop ──────────────────────────────────────── (integración)
        │
        ├── feature/task-crud ──────────────── (CRUD de tareas)
        ├── feature/ui-design ──────────────── (Diseño e interfaz)
        ├── feature/local-storage ──────────── (Persistencia)
        ├── feature/filters-search ─────────── (Filtros y búsqueda)
        │
        └── release/v1.0.0 ─────────────────── (Preparación release)
              │
              └── hotfix/fix-storage-bug ───── (Corrección urgente)
```

| Rama | Propósito | Origen | Destino |
|------|-----------|--------|---------|
| `main` | Código en producción | — | — |
| `develop` | Integración de desarrollo | `main` | `main` |
| `feature/*` | Nuevas funcionalidades | `develop` | `develop` |
| `release/*` | Preparación de versión | `develop` | `main` + `develop` |
| `hotfix/*` | Correcciones urgentes | `main` | `main` + `develop` |

---

## 📝 Convención de Commits

Se sigue la especificación **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]
```

### Tipos de commit

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de error |
| `docs` | Cambios en documentación |
| `style` | Cambios de formato (sin lógica) |
| `refactor` | Refactorización de código |
| `test` | Añadir o corregir pruebas |
| `ci` | Cambios en CI/CD |
| `chore` | Tareas de mantenimiento |

### Ejemplos

```bash
feat(storage): agregar función clearCompleted para limpiar tareas
fix(ui): corregir badge de conteo en filtro de categorías
docs(readme): actualizar sección de instalación
test(storage): agregar pruebas para updateTask con ID inexistente
ci(actions): configurar pipeline de deploy a GitHub Pages
```

---

## 🤖 CI/CD con GitHub Actions

### Pipeline de Integración Continua (`ci.yml`)

Se ejecuta automáticamente en cada **push** y **pull request** a `main`, `develop`, `feature/*`, `release/*` y `hotfix/*`:

```
Push / PR
    │
    ├─ 📥 Checkout
    ├─ ⚙️ Setup Node.js (18.x, 20.x) — Matriz de versiones
    ├─ 📦 npm ci
    ├─ 🔍 ESLint (análisis estático)
    ├─ 🧪 Jest (pruebas + cobertura)
    ├─ 📊 Upload coverage artifact
    └─ 🏗️ Verificar estructura de archivos
```

### Pipeline de Entrega Continua (`deploy.yml`)

Se activa al hacer **merge a `main`**:

```
Merge a main
    │
    ├─ 🧪 Ejecutar tests
    ├─ 🔍 Lint
    ├─ 🏗️ Build (copiar /src a /dist)
    └─ 🚀 Deploy a GitHub Pages
```

---

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Con reporte de cobertura
npm test -- --coverage

# Modo watch (desarrollo)
npm test -- --watch
```

### Suite de pruebas (8 bloques, 24+ casos)

| Bloque | Función | Tests |
|--------|---------|-------|
| 1 | `generateId()` | 3 |
| 2 | `createTaskObject()` | 3 |
| 3 | `getTasks()` / `saveTasks()` | 3 |
| 4 | `addTask()` | 3 |
| 5 | `updateTask()` | 4 |
| 6 | `deleteTask()` | 3 |
| 7 | `clearCompleted()` | 3 |
| 8 | Lógica de filtros | 5 |

---

## 🗂️ Estructura del Proyecto

```
PA2-CONSTRUCCION-SOFTWARE/
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI: Lint + Tests
│       └── deploy.yml      # CD: Deploy a GitHub Pages
├── src/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── styles.css      # Estilos (dark mode, glassmorphism)
│   └── js/
│       ├── app.js          # Controlador principal
│       ├── storage.js      # Módulo LocalStorage
│       └── ui.js           # Módulo DOM/renderizado
├── tests/
│   └── app.test.js         # Suite de pruebas Jest
├── docs/
│   └── GITFLOW_GUIDE.md    # Guía detallada de GitFlow
├── .eslintrc.json          # Configuración ESLint
├── .gitignore
├── babel.config.json       # Configuración Babel
├── package.json
└── README.md
```

---

## 👤 Autor

**Abel Maldonado Vasquez**
- GitHub: [@rodrigomaldonadov](https://github.com/rodrigomaldonadov)

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

<div align="center">
  Desarrollado con ❤️ para PA2 - Construcción de Software
</div>
