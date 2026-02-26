import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, MessageCircle, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { to: "/chat", label: "Chat", icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="CampusPreneur"
            className="h-10 w-auto"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 text-sm font-medium transition ${
                isActive(to)
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4 mr-2" />
            Login
          </Button>

          <Button size="sm">
            Get Started
          </Button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            <Button variant="ghost">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>

            <Button>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
