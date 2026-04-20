"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme="dark"
      position="top-center"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-5 text-emerald-400" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-5 text-red-400 animate-pulse" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={{
        "--normal-bg": "#09090b",
        "--normal-text": "#fafafa",
        "--normal-border": "#27272a",
        "--error-bg": "#1c0808",
        "--error-text": "#fca5a5",
        "--success-bg": "#071c12",
        "--success-text": "#6ee7b7",
        "--success-border": "#27272a",
        "--error-border": "#27272a",
        "--border-radius": "var(--radius)",
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          success: "shadow-[0_0_16px_rgba(52,211,153,0.25)]",
          error: "shadow-[0_0_16px_rgba(239,68,68,0.35)]",
        },
      }}
      {...props} />
  );
}

export { Toaster }
