// src/components/layout/Navbar.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShoppingCart,
  Package,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSession, readAuth } from "@/lib/authStorage";
import { cartCount } from "@/lib/cartStorage";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
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

  // close dropdown when clicking outside
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const dashboardPath = useMemo(() => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "entrepreneur") return "/dashboard/entrepreneur";
    return "/marketplace";
  }, [user]);

  // Cart badge (customer only)
  const cartBadge = useMemo(() => {
    if (!isLoggedIn || !user) return 0;
    if (user.role !== "customer") return 0;
    return cartCount();
  }, [isLoggedIn, user, loc.pathname]); // re-evaluate on navigation

  const onLoginClick = () => {
    clickCountRef.current += 1;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;

      // ✅ Security: mark intent so /admin-login can block direct access
      sessionStorage.setItem("cp_admin_intent", "1");

      nav("/admin-login");
      return;
    }

    nav("/login");
  };

  const onLogout = () => {
    clearSession();
    nav("/");
  };

  const navLinkClass = (href: string) =>
    [
      "text-sm px-3 py-2 rounded-lg transition",
      isActive(loc.pathname, href) ? "bg-gray-100 text-black" : "text-gray-700 hover:text-black hover:bg-gray-50",
    ].join(" ");

  return (
    <header className="w-full border-b bg-white sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          CampusPrenuer
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/marketplace" className={navLinkClass("/marketplace")}>
            Marketplace
          </Link>

          {/* Customer-only cart */}
          {isLoggedIn && user?.role === "customer" && (
            <button
              onClick={() => nav("/cart")}
              className={[
                "text-sm px-3 py-2 rounded-lg transition flex items-center gap-2",
                isActive(loc.pathname, "/cart") ? "bg-gray-100 text-black" : "text-gray-700 hover:text-black hover:bg-gray-50",
              ].join(" ")}
              type="button"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartBadge > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full border px-2 text-xs">
                  {cartBadge}
                </span>
              )}
            </button>
          )}

          {isLoggedIn && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-50"
                type="button"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {initials(user.name || "User")}
                </div>
                <span className="text-sm max-w-[140px] truncate">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-white shadow-sm overflow-hidden z-50">
                  <div className="px-3 py-2 border-b">
                    <div className="text-sm font-semibold truncate">{user.name}</div>
                    <div className="text-xs text-gray-600 truncate">{user.email}</div>
                  </div>

                  {/* Common */}
                  <button
                    onClick={() => nav(dashboardPath)}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                    type="button"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>

                  {/* Customer menu */}
                  {user.role === "customer" && (
                    <>
                      <button
                        onClick={() => nav("/orders")}
                        className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                        type="button"
                      >
                        <ListOrdered className="h-4 w-4" />
                        My Orders
                      </button>
                      <button
                        onClick={() => nav("/cart")}
                        className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                        type="button"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Cart
                      </button>
                    </>
                  )}

                  {/* Entrepreneur menu */}
                  {user.role === "entrepreneur" && (
                    <button
                      onClick={() => nav("/dashboard/entrepreneur/orders")}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                      type="button"
                    >
                      <Package className="h-4 w-4" />
                      Orders
                    </button>
                  )}

                  {/* Admin menu */}
                  {user.role === "admin" && (
                    <button
                      onClick={() => nav("/admin")}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                      type="button"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => nav("/settings")}
                    className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                    type="button"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <div className="border-t">
                    <button
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 text-red-600"
                      type="button"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>

                  <div className="px-3 py-2 border-t text-xs text-gray-500">
                    {user.role === "admin"
                      ? "Admin session"
                      : user.role === "entrepreneur"
                      ? "Entrepreneur account"
                      : "Customer account"}
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
