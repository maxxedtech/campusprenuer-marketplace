import { Star, Crown } from "lucide-react";

export const FeaturedBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
    <Star className="w-3 h-3" />
    Featured
  </span>
);

export const PremiumBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
    <Crown className="w-3 h-3" />
    Premium
  </span>
);
