import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
  LogOut,
  User,
  LayoutDashboard,
  Store,
  Shield,
  ChevronDown,
  Inbox,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/common/UserAvatar";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isVendor, isAdmin, signOut, loading } = useAuth();
  const { totalUnread: unread } = useUnreadMessages();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Close mobile menu whenever location changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const displayName = useMemo(() => {
    if (user?.role === "admin") return "Admin";
    return user?.name?.split(" ")[0] || "Account";
  }, [user]);

  const avatar = profile?.avatar_url ?? user?.avatar_url;

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    setMobileOpen(false);
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-border/70 shadow-sm transition-all">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-transform active:scale-95">
          <img
            src="/logo-icon.png"
            alt="Campuspreneur logo"
            className="h-9 w-9 object-contain drop-shadow-sm"
          />
          <span className="text-xl font-bold tracking-tight leading-none">
            <span className="text-brand-navy">Campus</span>
            <span className="text-brand-orange">preneur</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/marketplace"
            className={`flex items-center gap-1.5 transition-colors font-medium text-sm ${
              isActive("/marketplace")
                ? "text-brand-navy font-semibold"
                : "text-gray-600 hover:text-brand-navy"
            }`}
          >
            <Store className="w-4 h-4" />
            Marketplace
          </Link>

          {/* ADMIN DIRECT SHORTCUT */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 transition-colors font-bold text-sm px-3 py-1.5 rounded-xl ${
                isActive("/admin")
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Shield className="w-4 h-4 text-brand-orange" />
              Admin Panel
            </Link>
          )}

          {/* 💬 CHAT (Hidden for Admin) */}
          {user && user.role !== "admin" && (
            <Link
              to="/chat"
              className={`relative p-2 rounded-lg transition-all ${
                isActive("/chat") || isActive("/chat-room")
                  ? "bg-muted text-brand-navy"
                  : "text-gray-600 hover:text-brand-navy hover:bg-muted/60"
              }`}
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-brand-orange text-white text-[10px] font-bold px-1 rounded-full ring-2 ring-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          )}

          {/* 🛒 CART (Customer Only) */}
          {user?.role === "customer" && (
            <Link
              to="/cart"
              className={`p-2 rounded-lg transition-all ${
                isActive("/cart")
                  ? "bg-muted text-brand-navy"
                  : "text-gray-600 hover:text-brand-navy hover:bg-muted/60"
              }`}
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>
          )}

          {loading ? null : !user ? (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-brand-navy/30 text-brand-navy hover:bg-brand-navy hover:text-white font-medium transition-all"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/get-started")}
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-md shadow-brand-orange/20 transition-all active:scale-95"
              >
                Get Started
              </Button>
            </div>
          ) : (
            <div className="relative">
              {/* Single account menu trigger */}
              <button type="button" aria-label={`${displayName} account menu`} aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted/80 transition-all border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
                <UserAvatar user={{ full_name: profile?.full_name || user.name, avatar_url: avatar }} size="sm" />
                <span className="text-sm font-semibold text-brand-navy pr-1">{displayName}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-border rounded-2xl shadow-xl p-2 space-y-1 z-50"
                  >
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs text-muted-foreground">Signed in as</p>
                      <p className="text-sm font-bold text-brand-navy truncate">
                        {profile?.full_name || user.name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
                        {user.role}
                      </span>
                    </div>

                    <Link to={user.role === "admin" ? "/admin" : "/profile"} onClick={() => setProfileOpen(false)} className="w-full px-3 py-2 hover:bg-muted rounded-xl text-sm font-medium flex items-center gap-2.5 text-gray-700 hover:text-brand-navy transition"><User className="w-4 h-4 text-brand-navy" />My Profile</Link>

                    {user.role === "entrepreneur" && (
                      <Link to="/dashboard/entrepreneur" onClick={() => setProfileOpen(false)} className="w-full px-3 py-2 hover:bg-muted rounded-xl text-sm font-medium flex items-center gap-2.5 text-gray-700 hover:text-brand-navy transition">
                        <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                        Seller Studio
                      </Link>
                    )}

                    {user.role === "customer" && <Link to="/orders" onClick={() => setProfileOpen(false)} className="w-full px-3 py-2 hover:bg-muted rounded-xl text-sm font-medium flex items-center gap-2.5 text-gray-700 hover:text-brand-navy transition"><ClipboardList className="w-4 h-4" />My Orders</Link>}
                    {user.role !== "admin" && <Link to="/chat" onClick={() => setProfileOpen(false)} className="w-full px-3 py-2 hover:bg-muted rounded-xl text-sm font-medium flex items-center justify-between gap-2.5 text-gray-700 hover:text-brand-navy transition"><span className="flex items-center gap-2.5"><Inbox className="w-4 h-4" />Messages / Inbox</span>{unread > 0 && <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white">{unread > 99 ? "99+" : unread}</span>}</Link>}
                    <div className="my-1 border-t border-border/70" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-2.5 text-sm font-medium transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE & CHAT */}
        <div className="flex md:hidden items-center gap-2">
          {user && user.role !== "admin" && (
            <Link
              to="/chat"
              className="relative p-2 text-gray-700 hover:text-brand-navy"
            >
              <MessageCircle className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-brand-orange text-white text-[9px] font-bold px-1 rounded-full ring-2 ring-white">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-brand-navy hover:bg-muted rounded-lg transition"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-b border-border bg-white/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/marketplace"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                  isActive("/marketplace")
                    ? "bg-brand-navy text-white"
                    : "text-gray-700 hover:bg-muted"
                }`}
              >
                <Store className="w-4 h-4" />
                Marketplace
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
                    isActive("/admin")
                      ? "bg-brand-orange text-white"
                      : "text-slate-900 bg-slate-100"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              {user && user.role !== "admin" && (
                <>
                  <Link
                    to="/chat"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      isActive("/chat")
                        ? "bg-brand-navy text-white"
                        : "text-gray-700 hover:bg-muted"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <MessageCircle className="w-4 h-4" />
                      Messages
                    </span>
                    {unread > 0 && (
                      <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {unread} new
                      </span>
                    )}
                  </Link>

                  {user.role === "customer" && (
                    <Link
                      to="/cart"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                        isActive("/cart")
                          ? "bg-brand-navy text-white"
                          : "text-gray-700 hover:bg-muted"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Shopping Cart
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                      isActive("/profile")
                        ? "bg-brand-navy text-white"
                        : "text-gray-700 hover:bg-muted"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Profile &amp; Address
                  </Link>

                  {user.role === "entrepreneur" && (
                    <Link
                      to="/dashboard/entrepreneur"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                        isActive("/dashboard/entrepreneur")
                          ? "bg-brand-navy text-white"
                          : "text-gray-700 hover:bg-muted"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                      Seller Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* ACTION BUTTONS (MOBILE) */}
            <div className="pt-3 border-t border-border/70 flex flex-col gap-2">
              {!user ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full border-brand-navy text-brand-navy font-semibold"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/get-started");
                    }}
                    className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out ({displayName})
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
