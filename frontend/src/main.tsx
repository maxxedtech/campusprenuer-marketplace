import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessagesContext";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <UnreadMessagesProvider>
        <Toaster position="top-right" />
        <App />
      </UnreadMessagesProvider>
    </AuthProvider>
  </BrowserRouter>
);
