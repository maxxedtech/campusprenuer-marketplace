import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  ShoppingBag,
  LogOut,
  Store,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    {
      to: "/dashboard/entrepreneur",
      label: "Overview & Analytics",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/dashboard/entrepreneur/add",
      label: "Add New Product",
      icon: PlusCircle,
      end: false,
    },
    {
      to: "/dashboard/entrepreneur/products",
      label: "My Products & Inventory",
      icon: Package,
      end: false,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-border p-5 flex flex-col justify-between shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold shadow-md shadow-brand-orange/30">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-brand-navy text-sm leading-tight">
                  Seller Studio
                </h2>
                <p className="text-[11px] text-muted-foreground">Campus Business Suite</p>
              </div>
            </div>
          </div>

          {/* User info badge */}
          {user && (
            <div className="p-3 rounded-2xl bg-muted/50 border border-border/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-white font-bold flex items-center justify-center text-sm shrink-0">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-navy truncate flex items-center gap-1">
                  {user.name}
                  {user.verification_status === "verified" && (
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  )}
                </p>
                <p className="text-[10px] text-brand-orange font-semibold uppercase tracking-wider">
                  Entrepreneur
                </p>
              </div>
            </div>
          )}

          {/* Clean Styled Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-brand-navy text-white shadow-md shadow-brand-navy/20"
                      : "text-gray-600 hover:text-brand-navy hover:bg-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-gray-500"}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-border/60 space-y-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/marketplace")}
            className="w-full justify-start text-xs text-gray-600 hover:text-brand-navy gap-2 h-10 rounded-xl"
          >
            <ExternalLink className="w-4 h-4" />
            View Marketplace
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 gap-2 h-10 rounded-xl"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full">
        <Outlet />
      </main>
    </div>
  );
}
