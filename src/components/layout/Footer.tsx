import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="page-shell py-10">
        <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-bold text-brand-navy">Campus<span className="text-brand-orange">preneur</span></p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">A practical marketplace for student businesses, customers, and campus communities.</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-navy">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground"><Link className="hover:text-brand-navy" to="/marketplace">Marketplace</Link><Link className="hover:text-brand-navy" to="/get-started">Start selling</Link></div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-navy">Account</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground"><Link className="hover:text-brand-navy" to="/login">Log in</Link><Link className="hover:text-brand-navy" to="/signup/customer">Create account</Link></div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} CampusPreneur. All rights reserved.</p>
          <p>Built for campus commerce.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
