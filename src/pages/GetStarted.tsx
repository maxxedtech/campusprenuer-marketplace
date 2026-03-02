import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function GetStarted() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center">
      <div className="max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Ready to build on campus?
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Choose how you want to use CampusPreneur.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild className="min-w-[220px]">
              <Link to="/signup/entrepreneur">I’m an Entrepreneur</Link>
            </Button>

            <Button asChild variant="outline" className="min-w-[220px]">
              <Link to="/signup/customer">I’m a Customer</Link>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button asChild variant="ghost">
              <Link to="/login">Already have an account? Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
