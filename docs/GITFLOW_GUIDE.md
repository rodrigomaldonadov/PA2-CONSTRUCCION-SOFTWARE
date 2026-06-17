# Guía de GitFlow — TaskFlow
**PA2 - Construcción de Software**
Autor: Abel Maldonado Vasquez

---

## ¿Qué es GitFlow?

GitFlow es una estrategia de ramificación (branching strategy) para Git, propuesta por Vincent Driessen, que define un modelo robusto para gestionar proyectos de software con múltiples funcionalidades y versiones simultáneas.

### Ventajas de GitFlow
- Separación clara entre código en producción y código en desarrollo
- Facilita el trabajo en equipo sin interferencias entre funcionalidades
- Historial de commits limpio y comprensible
- Gestión ordenada de versiones (releases)
- Correcciones urgentes sin afectar el flujo de desarrollo

---

## Estructura de Ramas en TaskFlow

```
main
 │
 ├── develop
 │    ├── feature/task-crud
 │    ├── feature/ui-design
 │    ├── feature/local-storage
 │    └── feature/filters-search
 │
 ├── release/v1.0.0
 │
 └── hotfix/fix-storage-bug
```

### Descripción de cada rama

| Rama | Vida | Descripción |
|------|------|-------------|
| `main` | Permanente | Código en producción. Solo recibe merges de `release/*` y `hotfix/*`. |
| `develop` | Permanente | Rama de integración. Recibe merges de `feature/*`. |
| `feature/*` | Temporal | Una rama por funcionalidad. Se crea desde `develop`. |
| `release/*` | Temporal | Preparación del release. Se crea desde `develop`, se mergea a `main` y `develop`. |
| `hotfix/*` | Temporal | Corrección urgente en producción. Se crea desde `main`. |

---

## Comandos GitFlow — Paso a Paso

### 1. Configuración inicial

```bash
# Clonar el repositorio
git clone https://github.com/rodrigomaldonadov/PA2-CONSTRUCCION-SOFTWARE.git
cd PA2-CONSTRUCCION-SOFTWARE

# Configurar identidad
git config user.name "Abel Maldonado Vasquez"
git config user.email "tu@email.com"

# Crear rama develop desde main
git checkout main
git checkout -b develop
git push -u origin develop
```

---

### 2. Trabajar en una Feature

```bash
# Crear rama feature desde develop
git checkout develop
git pull origin develop
git checkout -b feature/task-crud

# ... hacer cambios ...

# Commits con convención
git add src/js/storage.js
git commit -m "feat(storage): implementar función addTask con validación de ID"

git add src/js/ui.js
git commit -m "feat(ui): agregar renderizado dinámico de tareas en el DOM"

git add tests/app.test.js
git commit -m "test(storage): agregar pruebas unitarias para CRUD de tareas"

# Subir la rama al remoto
git push -u origin feature/task-crud

# Crear Pull Request en GitHub: feature/task-crud → develop
# Después del merge, eliminar la rama local y remota
git checkout develop
git pull origin develop
git branch -d feature/task-crud
git push origin --delete feature/task-crud
```

---

### 3. Crear un Release

```bash
# Cuando develop tiene todas las features listas
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# Actualizar versión en package.json
# Verificar última vez: tests, lint, etc.
npm test
npm run lint

git add package.json
git commit -m "chore(release): bump versión a 1.0.0"

# Merge a main
git checkout main
git merge --no-ff release/v1.0.0 -m "chore: merge release/v1.0.0 a main"
git tag -a v1.0.0 -m "Release version 1.0.0 - TaskFlow MVP"
git push origin main --tags

# Merge back a develop
git checkout develop
git merge --no-ff release/v1.0.0 -m "chore: merge release/v1.0.0 a develop"
git push origin develop

# Eliminar rama release
git branch -d release/v1.0.0
git push origin --delete release/v1.0.0
```

---

### 4. Crear un Hotfix

```bash
# Corrección urgente en producción
git checkout main
git pull origin main
git checkout -b hotfix/fix-storage-bug

# ... corregir el bug ...
git add src/js/storage.js
git commit -m "fix(storage): corregir error al leer localStorage con JSON inválido"

# Merge a main
git checkout main
git merge --no-ff hotfix/fix-storage-bug -m "fix: merge hotfix/fix-storage-bug a main"
git tag -a v1.0.1 -m "Hotfix 1.0.1 - Corrección storage"
git push origin main --tags

# Merge a develop también
git checkout develop
git merge --no-ff hotfix/fix-storage-bug -m "fix: merge hotfix/fix-storage-bug a develop"
git push origin develop

# Eliminar rama hotfix
git branch -d hotfix/fix-storage-bug
git push origin --delete hotfix/fix-storage-bug
```

---

## Historial de Commits Esperado

```
* c9f2a1e (HEAD -> main, tag: v1.0.0) chore: merge release/v1.0.0 a main
|\
| * 7b3e8d2 (release/v1.0.0) chore(release): bump versión a 1.0.0
| * f1a4c90 docs(readme): actualizar documentación para v1.0.0
|/
* 4d2e7b1 (develop) feat: merge feature/filters-search a develop
|\
| * 3c1a8f2 feat(app): implementar búsqueda en tiempo real
| * 2b9e4d1 feat(ui): agregar filtros de categoría en sidebar
|/
* 9e5c3a0 feat: merge feature/local-storage a develop
|\
| * 8d4b2e1 test(storage): agregar pruebas para clearCompleted
| * 7c3a1f0 feat(storage): implementar persistencia con LocalStorage
|/
* 6b2e9d8 feat: merge feature/ui-design a develop
|\
| * 5a1c8e7 style(css): agregar animaciones y efectos glassmorphism
| * 4f0b7d6 feat(ui): implementar modal de edición y toast notifications
|/
* 3e9a4c5 feat: merge feature/task-crud a develop
|\
| * 2d8b3f4 test(storage): agregar suite de pruebas Jest (8 bloques)
| * 1c7a2e3 feat(app): implementar controlador principal con filtros
| * 0b6e1d2 feat(storage): implementar CRUD completo con LocalStorage
|/
* a5f4c3b ci: configurar pipelines CI/CD con GitHub Actions
* 9e3d2a1 chore: agregar configuración ESLint y Babel
* 8d2c1b0 chore: inicializar proyecto TaskFlow con estructura base
* 7c1b0a9 (origin/main) Initial commit
```

---

## Pull Requests — Buenas Prácticas

### Plantilla de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] feat: Nueva funcionalidad
- [ ] fix: Corrección de error
- [ ] docs: Documentación
- [ ] refactor: Refactorización

## Cambios realizados
- [ ] Archivo 1: descripción
- [ ] Archivo 2: descripción

## Pruebas
- [ ] Pruebas unitarias agregadas/actualizadas
- [ ] Todos los tests pasan (`npm test`)
- [ ] ESLint no reporta errores (`npm run lint`)

## Capturas (si aplica)
```

---

## Resolución de Conflictos

### ¿Cuándo ocurren?
Los conflictos ocurren cuando dos ramas modifican las mismas líneas del mismo archivo.

### Proceso de resolución

```bash
# 1. Intentar merge (y detectar conflicto)
git merge feature/mi-feature

# 2. Git marca los conflictos en el archivo:
# <<<<<<< HEAD
# código de la rama actual
# =======
# código de la rama entrante
# >>>>>>> feature/mi-feature

# 3. Editar manualmente el archivo, elegir la versión correcta

# 4. Marcar como resuelto
git add archivo-con-conflicto.js

# 5. Completar el merge
git commit -m "fix(merge): resolver conflicto en storage.js entre develop y feature"

# 6. Verificar que todo sigue funcionando
npm test
```

### Prevención de conflictos
- Hacer `git pull origin develop` frecuentemente antes de trabajar
- Ramas feature con vida corta (máximo 2-3 días)
- Commits pequeños y frecuentes
- Code reviews antes de hacer merge

---

## Recursos Adicionales

- [Git Flow Original](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow vs GitFlow](https://docs.github.com/en/get-started/using-github/github-flow)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
