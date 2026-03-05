// src/components/layout/Navbar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSession, readAuth } from "@/lib/authStorage";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
}

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, token } = readAuth();
  const isLoggedIn = Boolean(token && user);

  const [open, setOpen] = useState(false);

  // secret admin entry: click Login 3 times quickly
  const clickCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  const dashboardPath = useMemo(() => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "entrepreneur") return "/dashboard/entrepreneur";
    return "/marketplace";
  }, [user]);

  const onLoginClick = () => {
    clickCountRef.current += 1;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      nav("/admin-login");
      return;
    }

    nav("/login");
  };

  const onLogout = () => {
    clearSession();
    nav("/");
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg">
          CampusPrenuer
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/marketplace" className="text-sm text-gray-700 hover:text-black">
            Marketplace
          </Link>

          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {initials(user.name || "User")}
                </div>
                <span className="text-sm max-w-[140px] truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-sm overflow-hidden z-50">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-semibold truncate">{user.name}</div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                  </div>

                  <button
                    onClick={() => nav(dashboardPath)}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => nav("/settings")}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => nav("/admin")}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </button>
                  )}

                  <div className="border-t">
                    <button
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={onLoginClick}>
                Login
              </Button>
              <Button onClick={() => nav("/get-started")}>Get Started</Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
