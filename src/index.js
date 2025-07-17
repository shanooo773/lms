// ✅ All imports at the top
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import './index.css';

// ✅ Create Convex client
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

// ✅ Mount using createRoot (React 18+)
const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>
);
