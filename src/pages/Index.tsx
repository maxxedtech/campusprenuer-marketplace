import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { readAuth } from "@/lib/authStorage";

export default function Index() {
  const { user, token } = readAuth();
  const isLoggedIn = Boolean(token && user);

  return (
    <div className="min-h-[calc(100vh-5rem)]">
      {isLoggedIn && user?.name ? (
        <div className="mb-4 px-4 py-4 text-lg md:text-2xl font-bold max-w-6xl mx-auto">
          👋 Welcome back, {user.name}!
        </div>
      ) : null}

      <section className="px-4 pt-8 pb-12 md:px-6 md:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-muted/40 via-background to-muted/30">
            <div className="px-5 py-12 text-center md:px-12 md:py-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Your Campus Marketplace
              </div>

              <h1 className="mt-8 text-3xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Discover &amp; Support{" "}
                <span className="text-primary">Campus Businesses</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-sm md:text-lg leading-relaxed text-muted-foreground">
                CampusPrenuer connects students with entrepreneurs on campus.
                Buy products, hire services, and grow your campus economy.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="min-w-[190px]">
                  <Link to="/signup/entrepreneur">Start Selling</Link>
                </Button>

                <Button asChild variant="outline" className="min-w-[190px]">
                  <Link to="/marketplace">Browse Marketplace</Link>
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

      <section className="px-4 pb-14 md:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Verified campus listings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover student businesses, ratings, and a safer marketplace.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Buy &amp; sell fast</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse products and services with simple categories and search.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold">Chat and close deals</h3>
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
