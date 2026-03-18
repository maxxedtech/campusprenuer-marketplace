Thid is what I want to replace my navbar with
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

const campuses = [
  { id: "um", name: "University of Maiduguri" },
  { id: "kiu", name: "Kashim Ibrahim University" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [campusOpen, setCampusOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState(campuses[0]);

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

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
    setCampusOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenus();
    navigate("/login");
  };

  const handleSettings = () => {
    closeMenus();
    alert("Settings page coming soon");
  };

  const handleLoginClick = () => {
    loginClickCount.current += 1;

    if (loginClickTimer.current) {
      clearTimeout(loginClickTimer.current);
      loginClickTimer.current = null;
    }

    if (loginClickCount.current >= 3) {
      loginClickCount.current = 0;
      closeMenus();
      navigate("/admin-login");
      return;
    }

    loginClickTimer.current = setTimeout(() => {
      const clicks = loginClickCount.current;
      loginClickCount.current = 0;
      loginClickTimer.current = null;

      if (clicks < 3) {
        closeMenus();
        navigate("/login");
      }
    }, 700);
  };

  const selectCampus = (campus: typeof campuses[0]) => {
    setSelectedCampus(campus);
    setCampusOpen(false);
    // TODO: Add marketplace filter logic by campus
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-primary"
          onClick={closeMenus}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 text-white font-bold text-lg">
            C
          </span>
          <span>CampusPrenuer</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {/* Marketplace */}
          <Link
            to="/marketplace"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-gray-100 ${
              isActive("/marketplace") ? "bg-gray-100" : ""
            }`}
          >
            Marketplace
          </Link>

          {/* Campus Selector */}
          <div className="relative">
            <button
              onClick={() => setCampusOpen((v) => !v)}
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-gray-100 transition"
            >
              {selectedCampus.name} <ChevronDown className="h-4 w-4" />
            </button>
            {campusOpen && (
              <div className="absolute mt-1 w-60 rounded-lg border bg-white shadow-md">
                {campuses.map((campus) => (
                  <button
                    key={campus.id}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => selectCampus(campus)}
                  >
                    {campus.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chat & Cart */}
          {isLoggedIn && (
            <>
              <Link
                to="/chat"
                className={`rounded-lg p-2 transition hover:bg-gray-100 ${
                  isActive("/chat") ? "bg-gray-100" : ""
                }`}
                aria-label="Chat"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>

              {role === "customer" && (
                <Link
                  to="/cart"
                  className={`rounded-lg p-2 transition hover:bg-gray-100 ${
                    isActive("/cart") ? "bg-gray-100" : ""
                  }`}
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              )}
            </>
          )}

          {/* Auth Buttons */}
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
                className="flex items-center gap-3 rounded-xl border px-3 py-2 text-left hover:bg-gray-100 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">{displayName}</div>
                  <div className="text-xs text-gray-500">{roleLabel}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-lg">
                  <div className="border-b px-4 py-3">
                    <div className="text-sm font-semibold">{user?.name || "User"}</div>
                    <div className="text-xs text-gray-500">{roleLabel}</div>
                  </div>

                  <div className="p-2 space-y-1">
                    {role === "entrepreneur" && (
                      <button
                        onClick={() => {
                          closeMenus();
                          navigate("/dashboard/entrepreneur");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Entrepreneur Dashboard
                      </button>
                    )}

                    {role === "admin" && (
                      <button
                        onClick={() => {
                          closeMenus();
                          navigate("/admin");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </button>
                    )}

                    <button
                      onClick={handleSettings}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t md:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            <Link
              to="/marketplace"
              className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
              onClick={closeMenus}
            >
              Marketplace
            </Link>

            {/* Campus Selector */}
            <div className="relative">
              <button
                onClick={() => setCampusOpen((v) => !v)}
                className="flex w-full justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
              >
                {selectedCampus.name} <ChevronDown className="h-4 w-4" />
              </button>
              {campusOpen && (
                <div className="absolute mt-1 w-full rounded-lg border bg-white shadow-md z-10">
                  {campuses.map((campus) => (
                    <button
                      key={campus.id}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => selectCampus(campus)}
                    >
                      {campus.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Chat & Cart */}
            {isLoggedIn && (
              <>
                <Link
                  to="/chat"
                  className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  onClick={closeMenus}
                >
                  Chat
                </Link>
                {role === "customer" && (
                  <Link
                    to="/cart"
                    className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    onClick={closeMenus}
                  >
                    Cart
                  </Link>
                )}
              </>
            )}

            {/* Auth Buttons */}
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
                  <div className="text-sm font-semibold">{user?.name || "User"}</div>
                  <div className="text-xs text-gray-500">{roleLabel}</div>
                </div>

                <div className="space-y-1">
                  {role === "entrepreneur" && (
                    <button
                      onClick={() => {
                        closeMenus();
                        navigate("/dashboard/entrepreneur");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Entrepreneur Dashboard
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      onClick={() => {
                        closeMenus();
                        navigate("/admin");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleSettings}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
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
