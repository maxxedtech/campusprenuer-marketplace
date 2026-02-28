import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountRedirect() {
const navigate = useNavigate();
const location = useLocation();
const { user } = useAuth();

useEffect(() => {

    // Not logged in -> go to login hub (save where they came from)
    if (!user) {
    navigate("/login", {
        replace: true,
        state: { from: location.pathname },
    });
    return;
    }

    // Logged in -> redirect by role
    if (user.role === "entrepreneur") {
    navigate("/dashboard/entrepreneur", { replace: true });
    } else {
    navigate("/marketplace", { replace: true });
    }
}, [user, navigate, location.pathname]);

return (
    <div className="min-h-[50vh] flex items-center justify-center">
<p className="text-sm text-muted-foreground">Redirecting…</p>
    </div>
    );
}