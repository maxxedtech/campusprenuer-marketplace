import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EntrepreneurDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-white">
        <div className="p-4 border-b">
          <div className="font-semibold text-lg">Entrepreneur Dashboard</div>
          <div className="text-sm text-muted-foreground">Manage your products</div>
        </div>

        <nav className="p-3 flex flex-col gap-1">
          <NavLink
            to="/dashboard/entrepreneur"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted"
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/dashboard/entrepreneur/add"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted"
              }`
            }
          >
            Add Product
          </NavLink>

          <NavLink
            to="/dashboard/entrepreneur/products"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted"
              }`
            }
          >
            My Products
          </NavLink>

          <div className="mt-4 px-3">
            <Button variant="outline" className="w-full" onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="p-4 md:p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default EntrepreneurDashboard;
