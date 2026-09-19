import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import SplashScreen from "@/components/common/SplashScreen";

export default function AppLayout() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("campuspreneur_splash_seen");
  });

  const handleSplashDone = () => {
    sessionStorage.setItem("campuspreneur_splash_seen", "true");
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

