import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { readAuth, clearSession } from "@/lib/authStorage";
import { cartCount } from "@/lib/cartStorage";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, token } = readAuth();
  const isLoggedIn = Boolean(token && user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    if (user?.role === "customer") {
      setCartItems(cartCount());
    } else {
      setCartItems(0);
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    clearSession();
    nav("/");
    window.location.reload();
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    ...(isLoggedIn && user?.role === "entrepreneur"
      ? [{ to: "/dashboard/entrepreneur", label: "My Store" }]
      : []),
    ...(isLoggedIn && user?.role === "admin"
      ? [{ to: "/admin", label: "Admin" }]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="CampusPrenuer"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <Store className="h-6 w-6 text-orange-600" />
            <span className="text-xl font-bold text-foreground">
              CampusPrenuer
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition ${
                  location.pathname === link.to
                    ? "text-orange-600"
                    : "text-muted-foreground hover:text-orange-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && user?.role === "customer" && (
              <button
                onClick={() => nav("/cart")}
                className="relative p-2 text-muted-foreground hover:text-orange-600 transition"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => nav("/chat")}
                className="p-2 text-muted-foreground hover:text-orange-600 transition"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            )}

            {isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-foreground">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => nav("/login")}>
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => nav("/get-started")}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Get Started
                </Button>
              </div>
            )}

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-orange-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
