import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GetStarted() {
  return (
    <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-3xl">
        <div className="mx-auto max-w-xl text-center"><p className="eyebrow">Choose your path</p><h1 className="mt-3 page-title">Make campus commerce work for you</h1><p className="mt-3 text-base leading-7 text-muted-foreground">Create the account that matches how you want to use CampusPreneur. You can update your profile details later.</p></div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link to="/signup/customer" className="surface-card group p-6 transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-soft-lg focus-visible:ring-2"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-brand-orange"><ShoppingBag /></div><h2 className="mt-6 font-display text-xl font-semibold text-brand-navy">I’m here to shop</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Find useful products and services from student-led businesses.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-navy">Create customer account <ArrowRight className="h-4 w-4 text-brand-orange" /></span></Link>
          <Link to="/signup/entrepreneur" className="surface-card group p-6 transition hover:-translate-y-0.5 hover:border-brand-orange hover:shadow-soft-lg focus-visible:ring-2"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy text-white"><BriefcaseBusiness /></div><h2 className="mt-6 font-display text-xl font-semibold text-brand-navy">I’m here to sell</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Put your products, services, and campus business in front of more people.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-navy">Create seller account <ArrowRight className="h-4 w-4 text-brand-orange" /></span></Link>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-bold text-brand-navy hover:underline" to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
