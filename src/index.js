import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'; // ✅ Tailwind or global styles
import App from "./App";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);

ReactDOM.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>,
  document.getElementById("root")
);
