import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LoginHub() {
return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
        Choose your account type to continue.
        </p>

        <div className="mt-6 space-y-3">
        <Button asChild className="w-full">
            <Link to="/login/customer">Login as Customer</Link>
        </Button>

        <Button asChild variant="secondary" className="w-full">
            <Link to="/login/entrepreneur">Login as Entrepreneur</Link>
        </Button>

        <div className="pt-3 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link className="underline" to="/signup">
            Create one
            </Link>
        </div>

        </div>
    </div>
    </div>
);
}
