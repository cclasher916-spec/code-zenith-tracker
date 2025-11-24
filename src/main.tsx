import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { seedDepartments } from "./utils/seedDepartments";

// Make seedDepartments available in browser console for initial setup
(window as any).seedDepartments = seedDepartments;

createRoot(document.getElementById("root")!).render(<App />);
