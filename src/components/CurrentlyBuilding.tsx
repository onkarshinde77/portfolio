"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { siteConfig } from "@/data/site-config";

// export function CurrentlyBuilding() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ delay: 2, duration: 0.5 }}
//       className="pulse-border"
//       style={{
//         position: "fixed",
//         bottom: "2rem",
//         left: "1.5rem",
//         zIndex: 8000,
//         background: "var(--bg-card)",
//         border: "1px solid rgba(0,212,255,0.2)",
//         borderRadius: "10px",
//         padding: "0.75rem 1rem",
//         maxWidth: "220px",
//         display: "none"
//       }}
//       id="currently-building"
//     >
//       <div
//         style={{
//           fontFamily: "var(--font-code)",
//           fontSize: "9px",
//           color: "var(--text-muted)",
//           letterSpacing: "0.1em",
//           textTransform: "uppercase",
//           marginBottom: "4px"
//         }}
//       >
//         Currently building:
//       </div>
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "6px"
//         }}
//       >
//         <Zap size={12} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
//         <span
//           style={{
//             fontFamily: "var(--font-display)",
//             fontSize: "12px",
//             color: "var(--text-primary)",
//             fontWeight: 700
//           }}
//         >
//           {siteConfig.currentlyBuilding}
//         </span>
//       </div>

//       <style>{`
//         @media (min-width: 1024px) {
//           #currently-building { display: block !important; }
//         }
//       `}</style>
//     </motion.div>
//   );
// }
