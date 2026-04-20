"use client";

import PageBackground from "@/components/PageBackground";
import Navbar from "@/components/Navbar";
import BlurText from "@/components/BlurText";
import { Workflow } from "lucide-react";
import { TabsDashboard } from "@/components/Tabs";
import { Fade } from "react-awesome-reveal";

export default function DashboardPage() {
  return (
    <PageBackground>
      <Navbar />

      <main className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-x-5">
          <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[#DAA520]/10 ring-1 ring-[#DAA520]/30 p-4">
            <Workflow className="h-10 w-10 text-[#DAA520]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <BlurText
                text="Bienvenido al Sistema de"
                delay={100}
                animateBy="words"
                direction="bottom"
                className="text-4xl font-bold tracking-tight text-white"
              />
              <BlurText
                text="Continuidades"
                delay={100}
                animateBy="words"
                direction="bottom"
                className="text-4xl font-bold tracking-tight text-[#DAA520]"
              />
            </div>
            <BlurText
              text="Gestiona y consulta las continuidades de la Agencia Nacional de Aduanas de México."
              delay={40}
              animateBy="words"
              direction="bottom"
              className="text-sm text-zinc-400"
            />
          </div>
        </div>

        <Fade>
          <TabsDashboard />
        </Fade>
      </main>
    </PageBackground>
  );
}
