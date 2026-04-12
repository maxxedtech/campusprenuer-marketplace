import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadCount } from "@/lib/chat";
import { supabase } from "@/supabase";

type Role = "entrepreneur" | "customer" | "admin";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  const loginClickCount = useRef(0);
  const loginClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔥 LOAD USER + UNREAD
  useEffect(() => {
    const load = async () => {
      const u = await getCurrentUser();
      setUser(u);

      if (u) {
        const count = await getUnreadCount(u.id);
        setUnread(count);
      }
    };

    load();

    // 🔁 auto refresh unread every 5s
    const interval = setInterval(load, 5000);

    return () => clearInterval(interval);
  }, []);

  const isLoggedIn = !!user;
  const role = (user?.role || "customer") as Role;

  const displayName = useMemo(() => {
    return user?.name?.split(" ")[0] || "Account";
  }, [user]);

  const isActive = (path: string) => location.pathname === path;

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
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="bg-primary text-white px-2 py-1 rounded">C</span>
          CampusPrenuer
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-4">

          <Link
            to="/marketplace"
            className={isActive("/marketplace") ? "font-bold" : ""}
          >
            Marketplace
          </Link>

          {isLoggedIn && (
            <>
              {/* 🔥 CHAT ICON WITH BADGE */}
              <Link to="/chat" className="relative">
                <MessageCircle />

                {unread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                    {unread}
                  </span>
                )}
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
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="font-medium"
              >
                {displayName}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 space-y-1">

                  {role === "entrepreneur" && (
                    <button
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                      onClick={() => navigate("/dashboard/entrepreneur")}
                    >
                      Dashboard
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                      onClick={() => navigate("/admin")}
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    className="w-full text-left px-2 py-1 hover:bg-red-100 text-red-600 rounded flex items-center gap-1"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
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
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 border-t">

          <Link to="/marketplace">Marketplace</Link>

          {isLoggedIn && (
            <>
              <Link to="/chat" className="flex items-center gap-2">
                Chat
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 rounded">
                    {unread}
                  </span>
                )}
              </Link>

              {role === "customer" && (
                <Link to="/cart">Cart</Link>
              )}
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Button onClick={handleLoginClick} className="w-full">
                Login
              </Button>

              <Button
                onClick={() => navigate("/get-started")}
                className="w-full"
              >
                Get Started
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
