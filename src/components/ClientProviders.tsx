"use client";

import dynamic from "next/dynamic";

// These components access browser-only APIs and must not run during SSR.
// Wrapping them in a Client Component allows ssr:false to work correctly
// and eliminates hydration mismatches.
const GlobalNeuralBg = dynamic(
  () => import("@/components/GlobalNeuralBg").then(m => m.GlobalNeuralBg),
  { ssr: false }
);
const CustomCursor = dynamic(
  () => import("@/components/CustomCursor").then(m => m.CustomCursor),
  { ssr: false }
);
const CommandPalette = dynamic(
  () => import("@/components/CommandPalette").then(m => m.CommandPalette),
  { ssr: false }
);
// const CurrentlyBuilding = dynamic(
//   () => import("@/components/CurrentlyBuilding").then(m => m.CurrentlyBuilding),
//   { ssr: false }
// );
const ChatBot = dynamic(
  () => import("@/components/ChatBot").then(m => m.ChatBot),
  { ssr: false }
);

export function ClientProviders() {
  return (
    <>
      <GlobalNeuralBg />
      <CustomCursor />
      <CommandPalette />
      {/* <CurrentlyBuilding /> */}
      <ChatBot />
    </>
  );
}
