# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
Server (Express + MySQL)

 - **Install server deps**: open PowerShell in `server` and run:

```powershell
cd server
npm install
```

 - **Create MySQL database and table**: run the SQL in `server/schema.sql` against your MySQL server. Example using the `mysql` cli:

```powershell
mysql -u root -p < server/schema.sql
```

 - **Configure connection (optional)**: set environment variables `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` before starting the server. Defaults: host=127.0.0.1, user=root, password='', database=todo_db.

 - **Start server**:

# To‑Do List (Vite + React)

Proyecto ejemplo: una aplicación To‑Do con frontend en React (Vite) y dos alternativas de backend (Node/Express o FastAPI en Python). La base de datos es MySQL y se gestiona desde MySQL Workbench o un servicio externo (Railway, Render, etc.).

Servidor (Node/Express)

- **Instalar dependencias del servidor**: abre PowerShell en `server` y ejecuta:

```powershell
cd server
npm install
```

- **Crear la base de datos y la tabla**: ejecuta el script SQL `server/schema.sql` en tu servidor MySQL. Ejemplo con el cliente `mysql`:

```powershell
mysql -u root -p < server\schema.sql
```

- **Configurar la conexión** (opcional): puedes usar variables de entorno `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`. Valores por defecto: `127.0.0.1`, `root`, `''`, `todo_db`.

- **Iniciar el servidor**:

```powershell
cd server
npm start
```

El servidor Node/Express expone la API REST en `http://localhost:4000/api/tasks`.

Frontend (Vite + React)

- Inicia el frontend en desarrollo:

```powershell
npm install
npm run dev
```

- La app usa `import.meta.env.VITE_API_BASE` como URL base para la API. En desarrollo el `.env` raíz contiene `VITE_API_BASE=http://localhost:8000` (por defecto apuntando al backend FastAPI). Si prefieres usar el servidor Node, cambia a `http://localhost:4000`.

MySQL Workbench (ejecutar `server/schema.sql`)

- Abre **MySQL Workbench** y conéctate a tu servidor.
- Abre `server/schema.sql` (File → Open SQL Script...) o pega su contenido en una nueva pestaña de consulta.
- Ejecuta el script (botón "Execute"). Esto crea la base `todo_db` y la tabla `tasks`.

Uso de `.env`

- Copia `server/.env.example` a `server/.env` y completa tus credenciales si usas el servidor Node.
- Copia `backend/.env.example` a `backend/.env` y completa las credenciales si vas a usar FastAPI.
- No subas archivos `.env` al repositorio; usa Secrets en GitHub, Railway y Render.

FastAPI (backend en Python)

- En `backend/` hay una alternativa en FastAPI que expone los mismos endpoints (`/api/tasks`). Actualmente el backend usa `pymysql` para consultas directas a MySQL (sin ORM) para evitar problemas de compatibilidad en el entorno local.
- Para ejecutar el backend locally:

```powershell
cd backend
# (recomendado) crea y activa un virtualenv
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

- El backend FastAPI quedará en `http://localhost:8000/api/tasks`.

Despliegue (resumen rápido)

- Frontend: GitHub Pages con GitHub Actions (build de Vite → publicar `dist/`).
- Base de datos: Railway (provisionar MySQL, ejecutar `server/schema.sql`).
- Backend: Render (conectar repo, configurar variables de entorno con las credenciales de Railway, start command con `gunicorn`/`uvicorn`).

Problemas y dificultades que encontramos
------------------------------------

Durante el desarrollo surgieron varias dificultades que conviene documentar y que ya resolvimos o mitigamos:

- Migración SQLite → MySQL: al inicio se creó lógica para inicializar SQLite desde JS. El usuario pidió MySQL y gestionar la DB desde Workbench, así que eliminamos la creación automática en JavaScript y añadimos `server/schema.sql` para ejecutar manualmente la migración en MySQL.

- Configuración con MySQL Workbench: para facilitar el uso con Workbench añadimos `server/.env.example` y `backend/.env.example` y documentamos cómo pegar/ejecutar `server/schema.sql` desde la interfaz de Workbench.

- Pydantic y SQLAlchemy incompatibles: al instalar dependencias en Python aparecieron conflictos entre versiones de Pydantic y algunas librerías. Para evitar problemas con Python 3.13 y compatibilidades cambiamos la implementación del backend a consultas directas con `pymysql` en lugar de usar SQLAlchemy/ORM.

- Errores de imports en FastAPI (módulo no encontrado / relative import): al ejecutar `uvicorn` surgieron errores de importación por la forma de lanzar el servidor desde la raíz o desde dentro de `backend/`. Para resolverlo añadimos `backend/__init__.py` y adaptamos `main.py` para intentar imports absolutos y caer a imports relativos cuando sea necesario, de forma que `uvicorn backend.main:app` y `uvicorn main:app` funcionen en distintos entornos.

- `process` no definido en el navegador: Vite no expone `process.env` en el cliente. Cambiamos el frontend para usar `import.meta.env.VITE_API_BASE` y añadimos `.env` en la raíz con `VITE_API_BASE=http://localhost:8000` para apuntar al backend FastAPI en desarrollo.

- CORS y puertos: durante pruebas la app mostró `ERR_CONNECTION_REFUSED` cuando el backend no estaba activo o usábamos el puerto equivocado. Para evitar esto:
	- el backend tiene middleware CORS habilitado (temporalmente `allow_origins=["*"]`) para desarrollo;
	- documentamos los puertos usados (FastAPI: 8000, Node/Express: 4000, Vite: 5173) y cómo cambiarlos si es necesario.

Recomendaciones finales
----------------------

- Usa Secrets en GitHub y variables de entorno en Render/Railway en lugar de `.env` en repositorios.
- Si vas a usar producción, considera restringir CORS a tu dominio y usar un ORM robusto con migraciones (`Alembic` / `Flask-Migrate`) en lugar de crear tablas manualmente.
- Si quieres, puedo:
	- Crear el workflow de GitHub Actions para desplegar a GitHub Pages.
	- Preparar los pasos exactos para desplegar la DB en Railway y el backend en Render (incluyendo comandos a ejecutar y variables a configurar).

---

Si quieres que aplique alguno de los despliegues automáticos ahora (por ejemplo crear `.github/workflows/gh-pages.yml` listo para publicar), dime el nombre del repositorio o si vas a publicar en `/<repo>/` y lo configuro.
