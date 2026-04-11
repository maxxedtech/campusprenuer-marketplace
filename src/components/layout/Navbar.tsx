// src/components/layout/Navbar.tsx

import { useEffect, useMemo, useRef, useState } from "react";
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
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/supabase";

type Role = "entrepreneur" | "customer" | "admin";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);

  const loginClickCount = useRef(0);
  const loginClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔥 LOAD USER FROM SUPABASE
  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const isLoggedIn = !!user;
  const role = (user?.role || "customer") as Role;

  const displayName = useMemo(() => {
    return user?.name?.split(" ")[0] || "Account";
  }, [user]);

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const isActive = (path: string) => location.pathname === path;

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  // 🔥 LOGOUT (SUPABASE)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  const handleLoginClick = () => {
    loginClickCount.current++;

    if (loginClickTimer.current) {
      clearTimeout(loginClickTimer.current);
    }

    if (loginClickCount.current >= 3) {
      loginClickCount.current = 0;
      navigate("/admin-login");
      return;
    }

    loginClickTimer.current = setTimeout(() => {
      loginClickCount.current = 0;
      navigate("/login");
    }, 700);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">

        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="bg-primary text-white px-2 py-1 rounded">C</span>
          CampusPrenuer
        </Link>

        <div className="hidden md:flex items-center gap-3">

          <Link to="/marketplace" className={isActive("/marketplace") ? "font-bold" : ""}>
            Marketplace
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/chat">
                <MessageCircle />
              </Link>

              {role === "customer" && (
                <Link to="/cart">
                  <ShoppingCart />
                </Link>
              )}
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Button variant="ghost" onClick={handleLoginClick}>
                Login
              </Button>
              <Button onClick={() => navigate("/get-started")}>
                Get Started
              </Button>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}>
                {displayName}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow">

                  {role === "entrepreneur" && (
                    <button onClick={() => navigate("/dashboard/entrepreneur")}>
                      Dashboard
                    </button>
                  )}

                  {role === "admin" && (
                    <button onClick={() => navigate("/admin")}>
                      Admin Panel
                    </button>
                  )}

                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}

        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>

      </nav>
    </header>
  );
}
