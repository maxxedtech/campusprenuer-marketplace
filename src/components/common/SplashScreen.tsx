import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    // After logo animates in, hold for 1.2s then fade out
    const holdTimer = setTimeout(() => setPhase("out"), 2200);
    const doneTimer = setTimeout(() => onDone(), 3000);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "out" ? (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img
              src="/logo-icon.png"
              alt="Campuspreneur"
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            className="mt-5 text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          >
            <span className="text-white">Campus</span>
            <span className="text-brand-orange">preneur</span>
          </motion.div>

          {/* Tagline */}
          <motion.div
            className="mt-3 flex items-center gap-2 text-white/60 text-sm tracking-[0.25em] uppercase font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5, ease: "easeOut" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            Trade
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            Connect
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
            Grow
          </motion.div>

          {/* Subtle loading bar */}
          <motion.div
            className="mt-12 w-32 h-0.5 bg-white/10 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <motion.div
              className="h-full bg-brand-orange rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.1, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
