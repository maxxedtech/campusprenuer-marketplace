import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              CampusPreneur
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              Buy, sell, and connect with entrepreneurs on campus.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>

              <Button asChild>
                <Link to="/get-started">Get Started</Link>
              </Button>

              <Button asChild variant="ghost">
                <Link to="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="text-sm text-muted-foreground">
              Tip: Entrepreneurs can list products, edit, delete, and manage all
              their goods from <span className="font-medium">My Dashboard</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
