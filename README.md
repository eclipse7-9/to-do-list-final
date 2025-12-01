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

```powershell
cd server
npm start
```

The server exposes the REST API at `http://localhost:4000/api/tasks`.

Frontend

 - Start the Vite frontend as usual:

```powershell
npm install
npm run dev
```

MySQL Workbench (how to apply `server/schema.sql`)

 - Open **MySQL Workbench** and connect to your MySQL server.
 - In the SQL Editor, either open `server/schema.sql` (File → Open SQL Script...) or copy the file contents and paste into a new query tab.
 - Execute the script (click the lightning bolt / "Execute" button). This will create the `todo_db` database and the `tasks` table.

Using a `.env` file with this project

 - Copy `server/.env.example` to `server/.env` and fill your MySQL credentials (the values used by Workbench).
 - Alternatively you can export environment variables in PowerShell before starting the server. Example:

```powershell
$env:MYSQL_HOST='127.0.0.1'; $env:MYSQL_USER='root'; $env:MYSQL_PASSWORD='mypassword'; $env:MYSQL_DATABASE='todo_db'
npm start
```

 - If you use the `.env` file approach, the server will automatically load it (the project includes `dotenv`).

FastAPI backend (alternative)

 - I added a Python FastAPI backend in `backend/` that also exposes the same REST endpoints at `/api/tasks`.
 - It uses SQLAlchemy and connects to your MySQL database via `backend/.env` (copy from `backend/.env.example`).
 - To run the FastAPI backend:

```powershell
cd backend
python -m pip install -r requirements.txt
# create backend/.env from backend/.env.example and fill credentials (use the same Workbench values)
uvicorn backend.main:app --reload --port 8000
```

 - The FastAPI server will be available at `http://localhost:8000/api/tasks`.
 - Note: I intentionally do not auto-create the `tasks` table from this app because you said you wanted to manage the DB in Workbench — make sure the `todo_db` and `tasks` table exist (run `server/schema.sql` in Workbench).




## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
