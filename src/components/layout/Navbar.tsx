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

    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const isLoggedIn = !!user;
  const role = (user?.role || "customer") as Role;

  const displayName = useMemo(() => {
    return user?.name?.split(" ")[0] || "Account";
  }, [user]);

  const avatar = user?.avatar_url;

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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="bg-primary text-white px-2 py-1 rounded">C</span>
          CampusPrenuer
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-5">

          <Link
            to="/marketplace"
            className={`transition ${
              isActive("/marketplace") ? "font-semibold" : "text-gray-600"
            }`}
          >
            Marketplace
          </Link>

          {isLoggedIn && (
            <>
              {/* 💬 CHAT */}
              <Link to="/chat" className="relative">
                <MessageCircle />

                {unread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full shadow">
                    {unread}
                  </span>
                )}
              </Link>

              {/* 🛒 CART */}
              {role === "customer" && (
                <Link to="/cart">
                  <ShoppingCart />
                </Link>
              )}
            </>
          )}

          {/* AUTH */}
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

              {/* PROFILE BUTTON */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2"
              >
                {/* 🖼️ AVATAR */}
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                    {displayName.charAt(0)}
                  </div>
                )}

                <span className="text-sm font-medium">
                  {displayName}
                </span>
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg p-2 space-y-1">

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>

                  {role === "entrepreneur" && (
                    <button
                      onClick={() => navigate("/dashboard/entrepreneur")}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </button>
                  )}

                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    >
                      Admin Panel
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1 hover:bg-red-100 text-red-600 rounded flex items-center gap-2"
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
        <div className="md:hidden px-4 pb-4 space-y-3 border-t bg-white">

          <Link to="/marketplace">Marketplace</Link>

          {isLoggedIn && (
            <>
              <Link to="/chat" className="flex items-center gap-2">
                Chat
                {unread > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 rounded-full">
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
            <>
              <Button
                onClick={() => navigate("/profile")}
                className="w-full"
                variant="outline"
              >
                Profile
              </Button>

              <Button onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
