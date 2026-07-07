import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AddProjectPage } from './pages/AddProjectPage';
import { EditProjectPage } from './pages/EditProjectPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import TasksPage from './pages/TasksPage';
import AddTaskPage from './pages/AddTaskPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import EditTaskPage from './pages/EditTaskPage';
import MilestonesPage from './pages/MilestonesPage';
import AddMilestonePage from './pages/AddMilestonePage';
import MilestoneDetailsPage from './pages/MilestoneDetailsPage';
import EditMilestonePage from './pages/EditMilestonePage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import UserDetailsPage from './pages/UserDetailsPage';
import EditUserPage from './pages/EditUserPage';
import DocumentsPage from './pages/DocumentsPage';
import AlertsPage from './pages/AlertsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<AddProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<AddTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
        <Route path="/milestones" element={<MilestonesPage />} />
        <Route path="/milestones/new" element={<AddMilestonePage />} />
        <Route path="/milestones/:id" element={<MilestoneDetailsPage />} />
        <Route path="/milestones/:id/edit" element={<EditMilestonePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/new" element={<AddUserPage />} />
        <Route path="/users/:id" element={<UserDetailsPage />} />
        <Route path="/users/:id/edit" element={<EditUserPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/tasks/:id/edit"element={<EditTaskPage />}/>
      </Route>
    </Routes>
  );
}




