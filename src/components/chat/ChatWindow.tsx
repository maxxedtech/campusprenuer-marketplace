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
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white text-xs font-bold border border-white/10 hover:bg-white/10 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                    Complete your profile
                  </Link>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-2xl">
                Your campus marketplace hub is ready. Explore peer listings, message student businesses, and manage your orders.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 font-bold rounded-2xl h-11 px-5"
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
                  <h3 className="font-bold text-sm text-brand-navy">Add Listing</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Launch a new product</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
              >
                <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy">Verification</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Complete seller setup</p>
                </div>
              </Link>
            )}

            <Link
              to="/profile"
              className="bg-white p-5 rounded-3xl border border-border/80 shadow-md hover:shadow-lg hover:border-brand-orange/50 transition-all flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-navy">Profile</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Edit details & track status</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
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
              Empower Student Hustles. <span className="text-brand-orange block sm:inline">Trade On Campus.</span>
            </h1>

            <p className="text-lg sm:text-2xl font-bold text-gray-700 tracking-wide max-w-2xl mx-auto lg:mx-0">
              Trade Connect and Grow
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-2xl shadow-md shadow-brand-orange/25 px-7">
                <Link to="/get-started" className="flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="border-brand-navy text-brand-navy hover:bg-muted rounded-2xl px-7">
                <Link to="/marketplace" className="flex items-center gap-2">
                  <Store className="w-4 h-4" /> Browse Marketplace
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-border shadow-soft-xl rounded-[2rem] p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-[0.18em]">Campus Market</p>
                      <h3 className="font-black text-brand-navy text-lg">Student Buzz</h3>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">Live</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {recentProducts.length > 0 ? (
                    recentProducts.map((p) => (
                      <Link key={p.id} to={`/product/${p.id}`} className="group block rounded-2xl border border-border/80 bg-muted/30 p-2 hover:border-brand-orange/40 transition-all">
                        <div className="h-24 rounded-xl overflow-hidden bg-white mb-2">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Store className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-brand-navy line-clamp-1">{p.title}</h4>
                        <p className="text-[11px] text-brand-orange font-black mt-1">₦{Number(p.price).toLocaleString()}</p>
                      </Link>
                    ))
                  ) : (
                    <>
                      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center">
                        <Store className="w-6 h-6 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500 mt-2">No listings yet</p>
                      </div>
                      <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center">
                        <MessageCircle className="w-6 h-6 mx-auto text-gray-400" />
                        <p className="text-xs text-gray-500 mt-2">Chat live</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(({ name, icon: Icon, color }) => (
            <div key={name} className="bg-white border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-brand-navy text-sm">{name}</h3>
                <p className="text-[11px] text-muted-foreground">Campus trusted</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
