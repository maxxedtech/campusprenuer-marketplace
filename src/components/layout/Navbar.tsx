import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { readAuth } from "@/lib/authStorage";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const loginClickCount = useRef(0);
  const loginClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, token } = readAuth();
  const isLoggedIn = Boolean(token && user);
  const role = (user?.role ?? "unknown") as Role;

  const displayName = useMemo(() => {
    if (!user?.name) return "Account";
    return user.name.split(" ")[0];
  }, [user]);

  const roleLabel = useMemo(() => {
    if (role === "entrepreneur") return "Entrepreneur";
    if (role === "customer") return "Customer";
    if (role === "admin") return "Admin";
    return "Guest";
  }, [role]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const handleSettings = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    alert("Settings page coming soon");
  };

  const handleLoginClick = () => {
    loginClickCount.current += 1;

    if (loginClickTimer.current) {
      clearTimeout(loginClickTimer.current);
    }

    if (loginClickCount.current === 3) {
      loginClickCount.current = 0;
      navigate("/admin-login");
      return;
    }

    loginClickTimer.current = setTimeout(() => {
      if (loginClickCount.current < 3) {
        navigate("/login");
      }
      loginClickCount.current = 0;
    }, 500);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          onClick={() => {
            setMobileOpen(false);
            setProfileOpen(false);
          }}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            C
          </span>
          <span>CampusPrenuer</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/marketplace"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted ${
              isActive("/marketplace") ? "bg-muted" : ""
            }`}
          >
            Marketplace
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/chat"
                className={`rounded-lg p-2 transition hover:bg-muted ${
                  isActive("/chat") ? "bg-muted" : ""
                }`}
                aria-label="Chat"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>

              {role === "customer" && (
                <Link
                  to="/cart"
                  className={`rounded-lg p-2 transition hover:bg-muted ${
                    isActive("/cart") ? "bg-muted" : ""
                  }`}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
            </>
          )}

          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleLoginClick}>
                Login
              </Button>
              <Button onClick={() => navigate("/get-started")}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition hover:bg-muted"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>

                <div className="leading-tight">
                  <div className="text-sm font-semibold">{displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {roleLabel}
                  </div>
                </div>

                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-background shadow-lg">
                  <div className="border-b px-4 py-3">
                    <div className="text-sm font-semibold">
                      {user?.name || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {roleLabel}
                    </div>
                  </div>

                  <div className="p-2">
                    {role === "entrepreneur" && (
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/dashboard/entrepreneur");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Entrepreneur Dashboard
                      </button>
                    )}

                    {role === "admin" && (
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/admin");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </button>
                    )}

                    <button
                      onClick={handleSettings}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            <Link
              to="/marketplace"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              onClick={() => setMobileOpen(false)}
            >
              Marketplace
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/chat"
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Chat
                </Link>

                {role === "customer" && (
                  <Link
                    to="/cart"
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    Cart
                  </Link>
                )}
              </>
            )}

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="ghost" onClick={handleLoginClick}>
                  Login
                </Button>
                <Button onClick={() => navigate("/get-started")}>
                  Get Started
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border p-3">
                <div className="mb-3">
                  <div className="text-sm font-semibold">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {roleLabel}
                  </div>
                </div>

                <div className="space-y-1">
                  {role === "entrepreneur" && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/dashboard/entrepreneur");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Entrepreneur Dashboard
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        navigate("/admin");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleSettings}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
