import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children || <Outlet />}
      </main>
    </div>
  );
} 