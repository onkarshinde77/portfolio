"use client";

import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { GithubHeatmap } from "@/components/GithubHeatmap";
import { EvalDashboard } from "@/components/EvalDashboard";
import { ContactSection } from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <GithubHeatmap />
      <EvalDashboard />
      <ContactSection />
    </>
  );
}
