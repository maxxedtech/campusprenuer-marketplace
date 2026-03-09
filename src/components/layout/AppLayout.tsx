import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
