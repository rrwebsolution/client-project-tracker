# Client Project Tracker

Client Project Tracker is a full-stack web application for a digital agency to manage
client projects, their status, priority, and timelines. Project managers can create,
review, update, and delete projects through a REST API backed by a React dashboard.

## Project Structure

This assessment consists of two independently run projects:

```
client-project-tracker/
├── backend/
│   └── client-project-tracker-api/    Laravel REST API
├── frontend/
│   └── client-project-tracker-web/    React + TypeScript dashboard
└── README.md
```

- **backend/client-project-tracker-api/** — Handles API endpoints, request
  validation, business logic, and persistence to MySQL via Eloquent.
- **frontend/client-project-tracker-web/** — Handles the user interface: the
  project list, forms, filtering, dashboard statistics, and responsive UX,
  communicating with the backend over HTTP.

> This local environment lives under XAMPP's `htdocs` (so the backend can be
> served by PHP) with both projects nested under `backend/` and `frontend/` as
> shown above. If you clone `client-project-tracker-api` and
> `client-project-tracker-web` elsewhere, adjust the `cd` targets below to match.

## Setup Instructions

### Prerequisites

- PHP 8.2 or later
- Composer
- Node.js and npm
- MySQL

### Clone the Repository

```bash
git clone <repository-url>
cd client-project-tracker
```

### Backend Setup

```bash
cd backend/client-project-tracker-api
composer install
cp .env.example .env
```

On Windows:

```bash
copy .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

Configure the database in `backend/client-project-tracker-api/.env`:

```
DB_DATABASE=client_project_tracker
DB_USERNAME=root
DB_PASSWORD=
```

Create the database (MySQL must be running; this project does not create it for
you), then run migrations and seed the official assessment data:

```bash
mysql -u root -e "CREATE DATABASE client_project_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
php artisan migrate --seed
php artisan serve
```

The API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
cd frontend/client-project-tracker-web
npm install
```

Create a `.env` file with the API base URL used by the frontend:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (Vite will use the next free
port, e.g. `5174`, if `5173` is already in use).

### Database Seed Data

The project includes the 12 provided Client Project Tracker assessment records as
seed data (`ProjectSeeder`), with the original IDs and values preserved.

```bash
php artisan migrate:fresh --seed
```

**Warning:** `migrate:fresh` drops all existing tables before recreating and
seeding them. Only run this if you want to reset the database.

## Features Implemented

### Core Features

- View all client projects (table on desktop, cards on mobile)
- View individual project details
- Create projects
- Edit projects
- Delete projects, guarded by a confirmation dialog
- Project status management (Planning, In Progress, On Hold, Completed)
- Project priority management (Low, Medium, High)
- Start and due date tracking, with overdue projects visually flagged
- Client-side form validation for immediate feedback
- Server-side (API) validation as the source of truth
- Meaningful validation error responses returned to the frontend
- Responsive interface (desktop, tablet, mobile)
- Loading states (skeleton placeholders)
- Empty states (no projects yet / no results for current filters)
- Error states with a retry action
- Custom Tailwind CSS toast notifications (hand-built, no toast library)

### Additional Features

- Search projects by client name or project name
- Filter by status
- Filter by priority
- Sorting (newest, oldest, client name, project name, start date, due date, priority)
- Dashboard statistics (total, in progress, completed, high priority) and a
  project status breakdown
- Responsive mobile project cards
- Light / dark / system theme toggle

## Assumptions Made

- Authentication was not implemented, as it was listed as an optional bonus
  feature in the assessment requirements.
- The application is designed as a single project-management workspace without
  user accounts or organization-level separation.
- Project status is restricted to: Planning, In Progress, On Hold, Completed.
- Project priority is restricted to: Low, Medium, High.
- The 12 records supplied in `test_data.json` are treated as initial seed data,
  with their original IDs and values preserved.
- Due Date cannot be earlier than Start Date; this is enforced both client-side
  and server-side.
- Dates are handled as calendar dates (`YYYY-MM-DD`) without timezone conversion.
- Project deletion permanently removes the project, as soft deletion was not
  specified in the requirements.
- Search, filtering, sorting, and dashboard statistics are UI/productivity
  enhancements and do not change the required project data model.

## API Endpoints

| Method | Endpoint              | Description                                                        |
| ------ | ---------------------- | -------------------------------------------------------------------- |
| GET    | `/api/projects`       | Retrieve all projects (supports `search`, `status`, `priority`, `sort` query params) |
| GET    | `/api/projects/{id}`  | Retrieve a single project                                          |
| POST   | `/api/projects`       | Create a project                                                   |
| PUT    | `/api/projects/{id}`  | Update a project                                                   |
| DELETE | `/api/projects/{id}`  | Delete a project                                                   |

**Response status codes:** `200` on successful read/update, `201` on create,
`204` on delete, `404` when a project is not found, `422` on validation errors,
`500` on unexpected server errors.

## Validation Rules

- Client Name is required (string, max 255 characters).
- Project Name is required (string, max 255 characters).
- Description is optional.
- Status is required and must be one of: Planning, In Progress, On Hold, Completed.
- Priority is required and must be one of: Low, Medium, High.
- Start Date is required and must be a valid date.
- Due Date is required, must be a valid date, and cannot be earlier than Start Date.
- Invalid requests return a `422` response with field-level validation messages.

## Technical Decisions

- Laravel was used to provide a structured REST API with server-side validation
  and Eloquent ORM.
- React with TypeScript was used to build a maintainable, type-safe,
  component-based frontend.
- The frontend and backend are kept as separate projects to maintain clear
  responsibilities and independent deployment.
- Laravel Form Requests (`StoreProjectRequest`, `UpdateProjectRequest`) centralize
  request validation away from the controller.
- Axios, through a single centralized service layer, handles all frontend API
  communication instead of scattering HTTP calls across components.
- Reusable React components (project form, table, cards, status/priority badges,
  delete dialog, page header, stat cards, empty/error states) reduce duplication
  between pages.
- Tailwind CSS is used for responsive styling and theming, including a
  light/dark/system color scheme.
- Custom Tailwind CSS toast notifications are used instead of a third-party
  toast library.

## AI Usage Disclosure

AI-assisted development tools were used during this assessment to assist with
implementation, debugging, UI refinement, refactoring, and documentation. All
generated suggestions and code were reviewed, tested, understood, and adjusted
before inclusion in the final solution.

## Running the Application

Backend:

```bash
cd backend/client-project-tracker-api
php artisan serve
```

Frontend:

```bash
cd frontend/client-project-tracker-web
npm run dev
```
