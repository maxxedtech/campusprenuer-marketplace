import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          CampusPrenuer
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/marketplace" className="opacity-80 hover:opacity-100">
            Marketplace
          </Link>

          {user?.role === "entrepreneur" ? (
            <Link to="/dashboard/entrepreneur" className="opacity-80 hover:opacity-100">
              Dashboard
            </Link>
          ) : null}

          {user?.role === "admin" ? (
            <Link to="/admin" className="opacity-80 hover:opacity-100">
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : !user ? (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/get-started">Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-sm opacity-80">
                {user.name} • {user.role}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
