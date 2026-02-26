import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["5 Listings", "Basic profile", "Community chat"],
    current: true,
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    features: ["Unlimited listings", "Featured badge", "Priority support", "Analytics"],
    current: false,
  },
  {
    name: "Business",
    price: "$24.99/mo",
    features: ["Everything in Pro", "Multiple locations", "Ad placement", "API access"],
    current: false,
  },
];

const SubscriptionModal = ({ open, onOpenChange }: SubscriptionModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-secondary" />
          Upgrade Your Plan
        </DialogTitle>
        <DialogDescription>Choose the plan that fits your business needs.</DialogDescription>
      </DialogHeader>
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-4 flex flex-col ${
              plan.current ? "border-primary bg-muted/50" : "border-border"
            }`}
          >
            <h3 className="font-display font-bold text-lg">{plan.name}</h3>
            <p className="text-2xl font-bold mt-1">{plan.price}</p>
            <ul className="mt-4 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-mint-foreground" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.current ? "outline" : "default"}
              className="mt-4 w-full"
              disabled={plan.current}
            >
              {plan.current ? "Current" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default SubscriptionModal;
