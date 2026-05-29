import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../lib/api';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
