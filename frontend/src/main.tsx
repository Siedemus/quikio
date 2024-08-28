import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "sonner";

const RootComponent = () => {
  return (
    <>
      <App />
      <Toaster richColors />
    </>
  );
};

console.log(process.env.NODE_ENV);


createRoot(document.getElementById("root")!).render(
  process.env.NODE_ENV === "production" ? (
    <RootComponent />
  ) : (
    <StrictMode>
      <RootComponent />
    </StrictMode>
  )
);
