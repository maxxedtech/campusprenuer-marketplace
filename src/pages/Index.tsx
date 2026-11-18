import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Laptop, MessageCircle, Scissors, Shirt, ShieldCheck, Store, Utensils, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { name: "Tech & gadgets", icon: Laptop, tone: "bg-blue-50 text-blue-700" },
  { name: "Fashion & thrift", icon: Shirt, tone: "bg-orange-50 text-orange-700" },
  { name: "Food & treats", icon: Utensils, tone: "bg-emerald-50 text-emerald-700" },
  { name: "Services", icon: Scissors, tone: "bg-violet-50 text-violet-700" },
  { name: "Books & academics", icon: BookOpen, tone: "bg-amber-50 text-amber-700" },
  { name: "Campus community", icon: Users, tone: "bg-slate-100 text-slate-700" },
];

export default function Index() {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="page-shell py-10 sm:py-14">
        <section className="surface-card overflow-hidden bg-brand-navy p-6 text-white sm:p-10">
          <p className="eyebrow text-brand-orange">Your campus hub</p>
          <div className="mt-3 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl"><h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">Welcome back, {user.name.split(" ")[0]}.</h1><p className="mt-4 text-base leading-7 text-white/75">Discover student businesses, manage your account, and keep campus trade moving.</p></div>
            <div className="flex flex-wrap gap-3"><Button asChild variant="hero" size="lg"><Link to="/marketplace">Explore marketplace <ArrowRight /></Link></Button>{user.role === "entrepreneur" && <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Link to="/dashboard/entrepreneur">Seller dashboard</Link></Button>}</div>
          </div>
        </section>
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[{ title: "Browse campus goods", href: "/marketplace", icon: Store, copy: "Find products and services close to you." }, { title: "Message a seller", href: "/chat", icon: MessageCircle, copy: "Ask questions before you buy." }, { title: "Build your profile", href: "/profile", icon: ShieldCheck, copy: "Keep your account and verification details ready." }].map(({ title, href, icon: Icon, copy }) => <Link key={href} to={href} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:border-brand-orange/60 hover:shadow-soft"><Icon className="h-5 w-5 text-brand-orange" /><h2 className="mt-5 font-display text-lg font-semibold text-brand-navy">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{copy}</p></Link>)}
        </section>
      </div>
    );
  }

  return <div className="overflow-hidden"><section className="page-shell grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24"><motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><p className="eyebrow">The campus marketplace</p><h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-brand-navy sm:text-6xl">Trade, discover and grow <span className="text-brand-orange">on campus.</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">A trusted place for students to buy from, sell to and connect with the people building businesses around them.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero" size="lg"><Link to="/get-started">Get started <ArrowRight /></Link></Button><Button asChild variant="outline" size="lg"><Link to="/marketplace">Browse marketplace <Store /></Link></Button></div><p className="mt-5 text-sm text-muted-foreground">Built for customers, student entrepreneurs and campus administrators.</p></motion.div><motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }} className="relative"><div className="surface-card relative overflow-hidden p-5 shadow-soft-lg sm:p-7"><div className="flex items-center justify-between border-b border-border pb-5"><div><p className="eyebrow">CampusPreneur</p><h2 className="mt-1 font-display text-xl font-semibold text-brand-navy">A better way to buy local</h2></div><div className="rounded-xl bg-orange-50 p-3 text-brand-orange"><Store /></div></div><div className="mt-5 grid grid-cols-2 gap-3">{categories.slice(0, 4).map(({ name, icon: Icon, tone }) => <div key={name} className="rounded-xl border border-border/70 bg-muted/30 p-4"><div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></div><p className="mt-3 text-sm font-semibold text-brand-navy">{name}</p><p className="mt-1 text-xs text-muted-foreground">Explore listings</p></div>)}</div><div className="mt-5 rounded-xl bg-brand-navy p-4 text-white"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-orange" /><div><p className="text-sm font-semibold">Designed for trust</p><p className="mt-1 text-xs text-white/65">Clear profiles, direct conversations and simple discovery.</p></div></div></div></div></motion.div></section><section className="page-shell pb-16 sm:pb-24"><div className="grid gap-4 sm:grid-cols-3">{[{ label: "Discover", copy: "Find useful goods and services from student-led businesses." }, { label: "Connect", copy: "Talk directly with sellers when you need more context." }, { label: "Grow", copy: "Turn a campus skill or product into a visible business." }].map((item, index) => <div key={item.label} className="border-t-2 border-brand-orange pt-4"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-orange">0{index + 1}</p><h2 className="mt-3 font-display text-xl font-semibold text-brand-navy">{item.label}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p></div>)}</div></section></div>;
}
