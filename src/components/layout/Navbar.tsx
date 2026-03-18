import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readAuth } from "@/lib/authStorage";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, token } = readAuth();

  const isLoggedIn = Boolean(token && user);

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          CampusPrenuer
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/chat">
            <MessageCircle className="w-5 h-5" />
          </Link>
          <Link to="/cart">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Button size="sm" onClick={() => navigate("/account")}>
            <User className="w-4 h-4 mr-2" />
            {isLoggedIn ? "Account" : "Login"}
          </Button>
        </div>
      </nav>
    </header>
  );
}
