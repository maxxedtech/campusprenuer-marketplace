import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="grid md:grid-cols-[240px_1fr] min-h-screen">
      <aside className="border-r bg-white p-4">
        <h2 className="font-bold">Dashboard</h2>

        <nav className="mt-4 space-y-2">
          <NavLink to="/dashboard/entrepreneur">Overview</NavLink>
          <NavLink to="/dashboard/entrepreneur/add">Add Product</NavLink>
          <NavLink to="/dashboard/entrepreneur/products">My Products</NavLink>
        </nav>

        <Button onClick={handleLogout} className="mt-6">
          Logout
        </Button>
      </aside>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
