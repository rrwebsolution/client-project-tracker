import { Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardPage } from "@/pages/DashboardPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { CreateProjectPage } from "@/pages/CreateProjectPage";
import { EditProjectPage } from "@/pages/EditProjectPage";
import { ProjectDetailsPage } from "@/pages/ProjectDetailsPage";

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
      </Route>
    </Routes>
  );
}

export default App;
