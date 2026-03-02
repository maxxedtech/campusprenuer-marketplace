import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="min-h-[calc(100vh-5rem)]">
      {/* HERO */}
      <section className="pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-6">
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
                their goods from{" "}
                <span className="font-medium">My Dashboard</span>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Discover on Campus</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Find trusted student businesses around you — fast, simple, and safe.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Buy & Sell Easily</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse products and services with clear categories and easy navigation.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Connect & Chat</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Message sellers directly and close deals without stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BIG CTA (like your old page) */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background via-background to-muted/40 p-8 md:p-10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to build on campus?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Join student entrepreneurs and buyers on CampusPreneur.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild className="min-w-[200px]">
                  <Link to="/signup/entrepreneur">I’m an Entrepreneur</Link>
                </Button>

                <Button asChild variant="outline" className="min-w-[200px]">
                  <Link to="/signup/customer">I’m a Customer</Link>
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Or click <span className="font-medium">Get Started</span> to choose your role.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
