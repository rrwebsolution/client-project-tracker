# Client Project Tracker

## Overview

Client Project Tracker is a full-stack web application built for a digital agency to
manage client projects. Project managers use it to track project progress, deadlines,
statuses, and priorities across all active client engagements, through a polished,
professional dashboard interface.

## Features

**Required (all implemented and working)**

- View all projects in a responsive, sortable table (desktop) or card list (mobile)
- View a single project's full details
- Create a new project
- Edit an existing project
- Delete a project, guarded by a confirmation dialog
- Backend validation (required fields, enum constraints, due date ≥ start date)
- Fully responsive layout (desktop, tablet, mobile) with no horizontal scrolling
- Loading skeletons, empty states, and error states with retry

**Bonus (implemented and working)**

- Search by client name or project name
- Filter by status
- Filter by priority
- Sort by newest, oldest, client name, project name, start date, due date, or priority

## Tech Stack

**Frontend**

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- shadcn/ui (Base UI primitives)
- React Router
- Axios
- Lucide React icons
- Sonner for toast notifications

**Backend**

- Laravel 12 (PHP)
- Eloquent ORM
- Laravel Form Requests for validation

**Database**

- MySQL

## Project Structure

This assessment is organized as two independently runnable applications:

```
client-project-tracker-web/   # frontend (React + Vite + TypeScript)
client-project-tracker-api/   # backend (Laravel REST API)
```

In local development, the backend lives under the XAMPP `htdocs` directory
(`C:\xampp\htdocs\client-project-tracker-api`) so it can be served by Apache/PHP,
while the frontend lives in its own project folder. Adjust the `cd` paths below
to match wherever you clone the two folders.

## Backend Installation

```bash
cd client-project-tracker-api
composer install
cp .env.example .env
```

Configure MySQL in `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=client_project_tracker
DB_USERNAME=root
DB_PASSWORD=
```

Create the database (MySQL must be running):

```bash
mysql -u root -e "CREATE DATABASE client_project_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Then:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API will be available at `http://localhost:8000/api`.

Run the backend test suite (Pest):

```bash
php artisan test
```

## Frontend Installation

```bash
cd client-project-tracker-web
npm install
```

Create a `.env` file (or copy `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Then:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next free port, e.g.
`5174`, if `5173` is already in use — the backend's CORS config allows both).

## API Endpoints

| Method | Endpoint             | Description             |
| ------ | --------------------- | ------------------------ |
| GET    | `/api/projects`       | List all projects (supports `search`, `status`, `priority`, `sort` query params) |
| GET    | `/api/projects/{id}`  | Get a single project     |
| POST   | `/api/projects`       | Create a new project     |
| PUT    | `/api/projects/{id}`  | Update an existing project |
| DELETE | `/api/projects/{id}`  | Delete a project         |

**HTTP status codes**

- `200` — successful GET / PUT
- `201` — project created
- `204` — project deleted
- `404` — project not found
- `422` — validation error
- `500` — unexpected server error

## Validation

Enforced server-side (source of truth) via Laravel Form Requests, with matching
client-side checks for immediate UX feedback:

- **Client Name** — required, string, max 255 characters
- **Project Name** — required, string, max 255 characters
- **Description** — optional
- **Status** — required, one of `Planning`, `In Progress`, `On Hold`, `Completed`
- **Priority** — required, one of `Low`, `Medium`, `High`
- **Start Date** — required, valid date
- **Due Date** — required, valid date, must not be earlier than Start Date

## Technical Decisions

1. **Laravel** was selected because it provides clean REST API development,
   built-in validation, routing, and Eloquent ORM out of the box.
2. **React + TypeScript** was selected for a maintainable, type-safe,
   component-based frontend.
3. **Laravel Form Requests** (`StoreProjectRequest`, `UpdateProjectRequest`) keep
   validation rules separate from controller logic, keeping `ProjectController`
   thin and readable.
4. **A centralized Axios instance and `projectService`** prevent HTTP logic and
   API URLs from being scattered across components.
5. **A single reusable `ProjectForm` component** serves both the Create and Edit
   pages, avoiding duplicated form logic, validation, and error handling.
6. **Backend validation remains the source of truth.** The frontend performs the
   same checks for instant feedback, but every request is re-validated by the API,
   and server-side validation errors (422) are mapped back onto form fields.
7. **Search/status/priority filtering and sorting are implemented server-side**
   (`GET /api/projects?search=&status=&priority=&sort=`) so the UI scales the same
   way regardless of dataset size, rather than filtering an in-memory list.

## AI Usage Disclosure

AI-assisted development tools were used during this assessment to assist with
implementation, debugging, refactoring, and documentation. All AI-generated
suggestions and code were reviewed, tested, understood, and adjusted before
inclusion in the final submission.
