"use client"

import React from "react";
import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { LayoutDashboard, FileText } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Página principal", icon: FileText },
];

const images = [
  "/aduana1.jpg",
  "/aduana7.jpg",
  "/aduana3.jpeg",
  "/aduana4.jpeg",
  "/aduana5.jpg",
  "/aduana6.jpg",
];

export default function VortexDemo() {

  const handleRedirectToLogin = () => {
    window.location.href = "/login";

  }

  return (
    <div
      className="w-screen h-screen bg-gradient-to-b from-purple-600 to-blue-500 flex items-center justify-center">

      <Vortex
        backgroundColor="black"
        baseHue={161}
        rangeHue={8}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
        rangeY={500}
      >
        <ParallaxHeroImages className="opacity-50 absolute top-0 left-0 w-full h-full" images={images} />

        {/* Nav links */}
        <nav className="absolute top-0 left-0 right-0 flex justify-center pt-10 z-10">
          <ul className="flex items-center gap-1 rounded-full border border-white/8 bg-black/20 backdrop-blur-sm px-2 py-1.5">
            {NAV_LINKS.map(({ href, label, icon: Icon }, i) => (
              <React.Fragment key={href}>
                {i > 0 && <span className="w-px h-3 bg-white/10" />}
                <li>
                  <Link
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/35 hover:text-[#00a86b] hover:bg-[#00a86b]/8 transition-all duration-200"
                  >
                    <Icon className="size-3 shrink-0" />
                    {label}
                  </Link>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <img src="/anam_logo.png" alt="ANAM Logo" className="h-16 mb-2 logo-soft-bounce" />
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Sistema de <span className="text-[#DAA520]">Continuidades</span>
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Agencia Nacional de Aduanas de México
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button
            type="button"
            onClick={handleRedirectToLogin}
            className="flex w-full justify-center rounded-md bg-[#006847] px-5 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#00854e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006847] cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </div>
      </Vortex>
    </div>
  );
}
