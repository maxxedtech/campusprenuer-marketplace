import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Store,
  Sparkles,
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Zap,
  TrendingUp,
  ShoppingBag,
  Laptop,
  Shirt,
  Utensils,
  BookOpen,
  Scissors,
  CheckCircle2,
  Users,
  LayoutDashboard,
  User as UserIcon,
  PlusCircle,
  MapPin,
  HelpCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsSync } from "@/lib/products";
import type { LocalProduct } from "@/types/local";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentProducts, setRecentProducts] = useState<LocalProduct[]>([]);

  useEffect(() => {
    try {
      const items = getProductsSync();
      setRecentProducts(items.slice(0, 6));
    } catch {
      setRecentProducts([]);
    }
  }, []);

  const categories = [
    { name: "Tech & Gadgets", icon: Laptop, color: "bg-blue-500/10 text-blue-600" },
    { name: "Fashion & Thrift", icon: Shirt, color: "bg-orange-500/10 text-brand-orange" },
    { name: "Food & Treats", icon: Utensils, color: "bg-green-500/10 text-green-600" },
    { name: "Services & Design", icon: Zap, color: "bg-purple-500/10 text-purple-600" },
    { name: "Books & Academics", icon: BookOpen, color: "bg-amber-500/10 text-amber-600" },
    { name: "Beauty & Grooming", icon: Scissors, color: "bg-pink-500/10 text-pink-600" },
  ];

  // ----------------------------------------------------
  // LOGGED-IN VIEW: FANCY CAMPUS HUB & DASHBOARD EXPLORER
  // ----------------------------------------------------
  if (user) {
    return (
      <div className="min-h-screen bg-muted/20 pb-20">
        {/* TOP WELCOME HERO BANNER */}
        <section className="bg-brand-navy text-white pt-10 pb-16 px-4 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-bold uppercase tracking-wider">
                  Campus Member
                </span>
                {user.verification_status === "verified" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-400/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Trader
                  </span>
                ) : (
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold hover:underline"
                  >
                    ⚡ Get Verified
                  </Link>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Welcome, {user.name}! 👋
              </h1>

              <p className="text-sm text-gray-300 max-w-xl">
                Your campus marketplace hub is ready. Explore peer listings, message student businesses, or manage your orders.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl h-11 px-5 shadow-lg shadow-brand-orange/30"
              >
                <Link to="/marketplace" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Explore Market
                </Link>
              </Button>

              {user.role === "entrepreneur" ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-bold rounded-2xl h-11 px-5"
                >
                  <Link to="/dashboard/entrepreneur" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-brand-orange" />
                    Seller Dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-bold rounded-2xl h-11 px-5"
                >
                  <Link to="/profile" className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* HUB SHORTCUT CARDS */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/marketplace"
              className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-brand-orange flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-navy">Campus Market</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Browse student products</p>
              </div>
            </Link>

            <Link
              to="/chat"
              className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-navy">Live Chat</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Talk to campus sellers</p>
              </div>
            </Link>

            {user.role === "entrepreneur" ? (
              <Link
                to="/dashboard/entrepreneur/add"
                className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
              >
                <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy">Post Listing</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Sell item or service</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/cart"
                className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
              >
                <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy">Shopping Cart</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">View selected items</p>
                </div>
              </Link>
            )}

            <Link
              to="/profile"
              className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-navy">Verification</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Badges &amp; hostel address</p>
              </div>
            </Link>
          </div>
        </div>

        {/* RECENT CAMPUS DISCOVERIES */}
        <section className="max-w-6xl mx-auto px-4 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                Trending on Campus Right Now 🔥
              </h2>
              <p className="text-xs text-muted-foreground">
                Fresh listings from students around your university.
              </p>
            </div>
            <Button asChild variant="ghost" className="text-brand-orange font-bold text-xs gap-1">
              <Link to="/marketplace">
                See All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {recentProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-border space-y-3">
              <Store className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-600">No products uploaded yet.</p>
              {user.role === "entrepreneur" && (
                <Button asChild className="bg-brand-orange text-white rounded-2xl">
                  <Link to="/dashboard/entrepreneur/add">Post First Item</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="bg-white rounded-2xl border border-border p-3 hover:border-brand-orange/50 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="h-32 bg-muted rounded-xl overflow-hidden mb-2.5 relative">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Store className="w-6 h-6" />
                        </div>
                      )}
                      {p.category && (
                        <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-navy/90 text-white">
                          {p.category}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-brand-navy line-clamp-1">
                      {p.title}
                    </h4>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-black text-brand-orange">
                      ₦{Number(p.price).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      by {p.owner_name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* CAMPUS SAFETY & TRADING TIPS */}
        <section className="max-w-6xl mx-auto px-4 pt-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="p-2 rounded-xl bg-orange-100 text-brand-orange">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-navy">
                  Campus Trading &amp; Safety Guidelines
                </h3>
                <p className="text-xs text-muted-foreground">
                  How to make the most of Campuspreneur safely and securely.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs text-gray-600">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1.5">
                <span className="font-bold text-brand-navy flex items-center gap-1.5 text-sm">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  Public Campus Meetups
                </span>
                <p className="leading-relaxed">
                  Always arrange pickups in well-lit, public areas like campus libraries, faculty quads, or cafeteria halls.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1.5">
                <span className="font-bold text-brand-navy flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Inspect Before Paying
                </span>
                <p className="leading-relaxed">
                  Check items thoroughly (electronics, clothes, study materials) upon meeting before releasing payment.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 space-y-1.5">
                <span className="font-bold text-brand-navy flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Look for Verified Badges
                </span>
                <p className="leading-relaxed">
                  Sellers with the verified shield have been checked by university admins for maximum trust.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED-OUT PROMOTIONAL LANDING PAGE
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-muted/20 to-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative px-4 pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto w-full">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-navy/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-center lg:text-left space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-navy leading-[1.15]">
              Empower Student Hustles.{" "}
              <span className="text-brand-orange block sm:inline">Trade On Campus.</span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-gray-700 tracking-wide max-w-2xl mx-auto lg:mx-0">
              Trade Connect and Grow
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-w-[200px] h-12 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold shadow-lg shadow-brand-orange/25 text-base transition-all active:scale-95"
              >
                <Link to="/marketplace" className="flex items-center justify-center gap-2">
                  <Store className="w-5 h-5" />
                  Browse Market
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-[200px] h-12 border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold text-base transition-all active:scale-95"
              >
                <Link to="/signup/entrepreneur" className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                  Start Selling
                </Link>
              </Button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                <span>Zero Listing Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                <span>Direct In-App Messaging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                <span>Verified Campus Network</span>
              </div>
            </div>
          </motion.div>

          {/* MOCK PREVIEW CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-border/80">
              <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold">
                    CP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy">Campus Marketplace</h4>
                    <p className="text-[11px] text-muted-foreground">Live student business feed</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  Active (₦)
                </span>
              </div>

              <div className="bg-muted/40 rounded-2xl p-4 mb-4 border border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-orange/10 text-brand-orange">
                    Popular Item
                  </span>
                  <span className="text-sm font-extrabold text-brand-navy">₦15,000</span>
                </div>
                <div className="space-y-1">
                  <h5 className="text-base font-bold text-brand-navy">Campus Custom Hoodie &amp; Merch</h5>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    Hand-printed oversized fleece hoodie. Available in campus colors!
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-border/40">
                  <span className="font-medium">By David • Tech Faculty</span>
                  <span className="text-brand-orange font-semibold">★ 4.9 (24 reviews)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-brand-navy text-white p-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
                  "Hi! Do you have size Large for pickup near the library?"
                </div>
                <div className="bg-orange-50 text-brand-navy border border-brand-orange/20 p-2.5 rounded-2xl rounded-tr-sm max-w-[85%] ml-auto font-medium">
                  "Yes! I can meet you at 2:00 PM today! 🚀"
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50">
                <Button asChild className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold rounded-xl text-xs h-10">
                  <Link to="/marketplace">Explore All Campus Deals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-border bg-white text-gray-600 text-sm py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.png" alt="Campuspreneur" className="w-7 h-7 object-contain" />
            <span className="font-bold text-brand-navy">
              Campus<span className="text-brand-orange">preneur</span>
            </span>
            <span className="text-xs text-muted-foreground pl-2 border-l border-border">
              Trade • Connect • Grow
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <Link to="/marketplace" className="hover:text-brand-navy transition">Marketplace</Link>
            <Link to="/login" className="hover:text-brand-navy transition">Login</Link>
            <Link to="/signup/customer" className="hover:text-brand-navy transition">Buyer Signup</Link>
            <Link to="/signup/entrepreneur" className="hover:text-brand-navy transition">Seller Signup</Link>
          </div>

          <p className="text-xs text-gray-400 text-center md:text-right">
            © {new Date().getFullYear()} Campuspreneur. Built by David Adamson (Maxxedtech).
          </p>
        </div>
      </footer>
    </div>
  );
}
