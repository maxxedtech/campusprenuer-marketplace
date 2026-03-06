import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/lib/authStorage";

const EntrepreneurDashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white">
        <div className="border-b p-4">
          <div className="text-base md:text-lg font-semibold">
            Entrepreneur Dashboard
          </div>
          <div className="text-sm text-muted-foreground">
            Manage your products
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <NavLink
            to="/dashboard/entrepreneur"
            end
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted"
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/dashboard/entrepreneur/add"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
                isActive ? "bg-muted font-medium" : "hover:bg-muted"
              }`
            }
          >
            Add Product
          </NavLink>

          <NavLink
            to="/dashboard/entrepreneur/products"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${
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

      <main className="bg-gray-50 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default EntrepreneurDashboard;
