"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/", label: "Página principal", icon: FileText },
];

const isActivePath = (pathname, href) => {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full animate-[navbar-in_0.45s_ease-out]">
      <div className="relative overflow-hidden border-b border-white/8 bg-[linear-gradient(135deg,rgba(18,20,24,0.96),rgba(11,18,15,0.94))] shadow-[0_16px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DAA520]/60 to-transparent" />
        <div className="pointer-events-none absolute left-0 top-0 h-28 w-44 bg-[#006847]/12 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-36 bg-[#DAA520]/10 blur-3xl" />

        <nav className="relative flex min-h-[84px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="group flex min-w-0 items-center gap-4 pr-2 transition-all duration-300"
          >
            <Image
              src="/anam_logo.png"
              alt="ANAM"
              width={172}
              height={48}
              className="h-10 w-auto object-contain brightness-110 transition-all duration-300 group-hover:brightness-125"
            />

            <div className="hidden min-w-0 border-l border-white/10 pl-4 lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#DAA520]/80">
                ANAM
              </p>
              <p className="truncate text-sm font-semibold text-white">
                Sistema de Continuidades
              </p>
              <p className="text-xs text-zinc-400">
                Panel administrativo
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 justify-center sm:flex md:absolute md:left-1/2 md:top-1/2 md:w-max md:flex-none md:-translate-x-1/2 md:-translate-y-1/2">
            <ul className="flex items-center gap-1 rounded-full border border-white/8 bg-black/20 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActivePath(pathname, href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                        active
                          ? "text-white"
                          : "text-zinc-400 hover:text-zinc-100"
                      }`}
                    >
                      <span
                        className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                          active
                            ? "border-[#DAA520]/20 bg-gradient-to-r from-[#DAA520]/18 via-zinc-900/95 to-[#006847]/20 shadow-[0_12px_25px_rgba(0,0,0,0.26)]"
                            : "border-transparent bg-transparent group-hover:border-white/8 group-hover:bg-white/[0.05]"
                        }`}
                      />
                      <Icon
                        className={`relative h-4 w-4 transition-colors duration-300 ${
                          active
                            ? "text-[#DAA520]"
                            : "text-zinc-500 group-hover:text-[#00a86b]"
                        }`}
                      />
                      <span className="relative">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-zinc-400 transition-all duration-300 hover:border-[#006847]/30 hover:bg-[#006847]/10 hover:text-white"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#00a86b] ring-2 ring-[#14161a]" />
            </button>

            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-2xl border border-[#DAA520]/15 bg-[#DAA520]/8 px-3 py-2.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-[#DAA520]/30 hover:bg-[#DAA520]/14 hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/20 text-[#DAA520] transition-transform duration-300 group-hover:translate-x-0.5">
                <LogOut className="h-4 w-4" />
              </span>
              <span>Salir</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-zinc-300 transition-all duration-300 hover:border-[#DAA520]/20 hover:bg-white/[0.06] sm:hidden"
            aria-expanded={open}
            aria-label="Abrir menú"
          >
            <Menu
              className={`absolute h-5 w-5 transition-all duration-200 ${
                open ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-200 ${
                open ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0"
              }`}
            />
          </button>
        </nav>

        <div
          className={`overflow-hidden px-4 transition-all duration-300 ease-in-out sm:hidden ${
            open ? "max-h-80 pb-4" : "max-h-0"
          }`}
        >
          <div className="rounded-2xl border border-white/8 bg-black/20 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActivePath(pathname, href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "border border-[#DAA520]/20 bg-gradient-to-r from-[#DAA520]/16 to-[#006847]/16 text-white"
                          : "text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          active
                            ? "bg-black/20 text-[#DAA520]"
                            : "bg-white/[0.04] text-zinc-400"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-2 flex items-center gap-2 border-t border-white/8 pt-2">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-zinc-300 transition-colors duration-200 hover:text-white"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#DAA520]/15 bg-[#DAA520]/8 px-4 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:border-[#DAA520]/30 hover:bg-[#DAA520]/14"
              >
                <LogOut className="h-4 w-4 text-[#DAA520]" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
