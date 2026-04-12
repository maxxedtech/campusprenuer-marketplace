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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [unread, setUnread] = useState(0);

  const loginClickCount = useRef(0);
  const loginClickTimer = useRef<any>(null);

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
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const displayName = useMemo(() => {
    return user?.name?.split(" ")[0] || "Account";
  }, [user]);

  const avatar = user?.avatar_url;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b shadow-sm transition-all">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg hover:scale-105 transition">
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

          {/* 💬 CHAT */}
          {user && (
            <Link to="/chat" className="relative hover:scale-110 transition">
              <MessageCircle />

              {unread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full animate-pulse">
                  {unread}
                </span>
              )}
            </Link>
          )}

          {/* 🛒 CART */}
          {user?.role === "customer" && (
            <Link to="/cart" className="hover:scale-110 transition">
              <ShoppingCart />
            </Link>
          )}

          {!user ? (
            <>
              <Button onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/get-started")}>
                Get Started
              </Button>
            </>
          ) : (
            <div className="relative">

              {/* PROFILE */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:scale-105 transition"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-9 h-9 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                    {displayName[0]}
                  </div>
                )}
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl border rounded-xl shadow-lg p-2 space-y-1 animate-in fade-in zoom-in-95">

                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/entrepreneur")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Dashboard
                  </button>

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

        {/* MOBILE */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
}
