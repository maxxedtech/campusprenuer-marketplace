import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  // ✅ Get the user name from localStorage (if available)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const name = user.name || "Entrepreneur";

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      {/* WELCOME MESSAGE */}
      <div className="mb-6 px-6 text-2xl font-bold">
        👋 Welcome back, {name}!
      </div>

      {/* HERO SECTION */}
      <section className="px-6 pt-10 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-muted/40 via-background to-muted/30 overflow-hidden">
            <div className="px-6 py-16 md:px-12 md:py-24 text-center">
              {/* pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Your Campus Marketplace
              </div>

              <h1 className="mt-8 text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Discover &amp; Support{" "}
                <span className="text-primary">Campus Businesses</span>
              </h1>

              <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-base md:text-lg leading-relaxed">
                CampusPreneur connects students with entrepreneurs on campus. Buy
                products, hire services, and grow your campus economy.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                {/* Start Selling = entrepreneur flow */}
                <Button asChild className="min-w-[190px]">
                  <Link to="/signup/entrepreneur">Start Selling</Link>
                </Button>

                {/* Browse Marketplace = protected, will redirect to /login if not logged in */}
                <Button asChild variant="outline" className="min-w-[190px]">
                  <Link to="/marketplace">Browse Marketplace →</Link>
                </Button>
              </div>

              <div className="mt-6 text-xs text-muted-foreground">
                New here? You can also{" "}
                <Link to="/get-started" className="underline underline-offset-4">
                  Get Started
                </Link>{" "}
                and choose a role.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURE ROW */}
      <section className="px-6 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Verified campus listings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover student businesses, ratings, and a safer marketplace.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Buy &amp; sell fast</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse products and services with simple categories and search.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg">Chat and close deals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Message sellers directly and settle details quickly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
