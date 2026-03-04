import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

        <Link to="/" className="font-bold text-lg">
          CampusPrenuer
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/marketplace">Marketplace</Link>

          {user?.role === "entrepreneur" && (
            <Link to="/dashboard/entrepreneur">Dashboard</Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin">Admin</Link>
          )}
        </nav>

        <div className="flex gap-2">
          {!user ? (
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
              <span className="text-sm opacity-80">
                {user.name ?? "Account"} • {user.role}
              </span>

              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
