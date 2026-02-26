import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ShoppingBag,
  MessageCircle,
  Store,
  ArrowRight,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Store,
    title: "Create Your Shop",
    desc: "Set up your student business profile and start listing products or services in minutes.",
  },
  {
    icon: MapPin,
    title: "Campus Discovery",
    desc: "Students find you by campus location. Your school is your marketplace.",
  },
  {
    icon: MessageCircle,
    title: "Direct Chat",
    desc: "Connect with buyers instantly through real-time messaging.",
  },
  {
    icon: ShoppingBag,
    title: "Buy & Hire",
    desc: "Browse campus products and services with powerful category filters.",
  },
  {
    icon: Shield,
    title: "Trusted Community",
    desc: "Verified student businesses, ratings, and a safe campus marketplace.",
  },
];

const Index = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden gradient-hero">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-sm font-medium text-primary-foreground mb-6">
            <MapPin className="w-4 h-4" />
            Your Campus Marketplace
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight text-foreground">
            Discover & Support{" "}
            <span className="text-primary">Campus Businesses</span>
          </h1>

          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            CampusPrenue connects students with entrepreneurs on campus.
            Buy products, hire services, and grow your campus economy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link to="/signup/entrepreneur">
              <Button size="lg" className="gap-2 px-8">
                <Store className="w-4 h-4" />
                Start Selling
              </Button>
            </Link>

            <Link to="/marketplace">
              <Button variant="outline" size="lg" className="gap-2 px-8">
                Browse Marketplace
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-12">
        Everything You Need
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="card-soft hover:shadow-soft-lg transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-3">
              <f.icon className="w-5 h-5 text-primary-foreground" />
            </div>

            <h3 className="font-display font-bold">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container mx-auto px-4 pb-20">
      <div className="card-soft text-center gradient-hero py-12">
        <h2 className="text-2xl font-display font-bold">
          Ready to build on campus?
        </h2>

        <p className="text-muted-foreground mt-2">
          Join hundreds of student entrepreneurs and buyers on CampusPrenue.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <Link to="/signup/entrepreneur">
            <Button size="lg">I'm an Entrepreneur</Button>
          </Link>

          <Link to="/signup/customer">
            <Button variant="outline" size="lg">
              I'm a Customer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Index;
