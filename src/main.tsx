import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster position="top-right" />
      <App />
    </AuthProvider>
  </BrowserRouter>
);
