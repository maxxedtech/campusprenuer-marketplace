import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, User, LogOut, Menu, X, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cartCount } from "@/lib/cartStorage";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    if (user?.role === "customer") {
      setCartItems(cartCount());
    } else {
      setCartItems(0);
    }
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    nav("/");
  };

  return (
    <nav className="bg-white border-b p-4 flex justify-between">
      <Link to="/">CampusPrenuer</Link>

      <div className="flex gap-3">
        {isLoggedIn && <button onClick={() => nav("/chat")}><MessageCircle /></button>}

        {isLoggedIn && (
          <button onClick={handleLogout}>
            <LogOut />
          </button>
        )}

        {!isLoggedIn && (
          <Button onClick={() => nav("/login")}>Login</Button>
        )}
      </div>
    </nav>
  );
}
