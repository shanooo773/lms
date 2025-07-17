import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
   // ✅ your own client
// src/index.js or src/main.jsx
import './index.css'; // ✅ Tailwind or global styles

ReactDOM.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>,
  document.getElementById("root")
);
