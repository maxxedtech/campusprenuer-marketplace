import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, MessageCircle, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type Role = "entrepreneur" | "customer" | "admin" | "unknown";

type StoredUser = {
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: Role;
};

const AUTH_CHANGED_EVENT = "auth-changed";

function readUserFromStorage() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: StoredUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  const isLoggedIn = Boolean(token && user);
  const name =
    user?.name || user?.fullName || user?.username || user?.email || "My Account";
  const role = (user?.role as Role) || "unknown";

  return { isLoggedIn, name, role };
}

function roleLabel(role: Role) {
  if (role === "entrepreneur") return "Entrepreneur";
  if (role === "customer") return "Customer";
  if (role === "admin") return "Admin";
  return "Account";
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [auth, setAuth] = useState(() => readUserFromStorage());

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);

  // ✅ Role-aware links
  const navLinks = [
    { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { to: "/chat", label: "Chat", icon: MessageCircle },
    ...(auth.isLoggedIn && auth.role === "entrepreneur"
      ? [{ to: "/dashboard/entrepreneur", label: "My Dashboard", icon: LayoutDashboard }]
      : []),
  ];

  useEffect(() => {
    // initial
    setAuth(readUserFromStorage());

    const onAuthChanged = () => setAuth(readUserFromStorage());
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);

    const onStorage = () => setAuth(readUserFromStorage());
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    navigate("/login"); // ✅ /login exists now (alias)
  };

  const accountTarget =
    auth.role === "entrepreneur" ? "/dashboard/entrepreneur" : "/marketplace";

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="CampusPreneur" className="h-14 w-auto" />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isActive(to)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          {!auth.isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>

              <Button size="sm" asChild>
                <Link to="/get-started">Get Started</Link>
              </Button>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-3 rounded-full border border-border px-4 py-2 hover:bg-muted transition"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-foreground">
                    {auth.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {roleLabel(auth.role)}
                  </span>
                </div>

                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {roleLabel(auth.role)}
                </span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-lg overflow-hidden">
                  <Link
                    to={accountTarget}
                    className="block px-4 py-3 text-sm hover:bg-muted"
                  >
                    My Account
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {!auth.isLoggedIn ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/get-started">Get Started</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-sm font-medium">{auth.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {roleLabel(auth.role)}
                  </div>
                </div>

                <Button variant="ghost" asChild>
                  <Link to={accountTarget}>My Account</Link>
                </Button>

                <Button variant="destructive" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
