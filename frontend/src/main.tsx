import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";

const ENV = import.meta.env.NODE_ENV;

const RootComponent = () => {
  return (
    <>
      <App />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  ENV === "production" ? (
    <RootComponent />
  ) : (
    <StrictMode>
      <RootComponent />
    </StrictMode>
  )
);
