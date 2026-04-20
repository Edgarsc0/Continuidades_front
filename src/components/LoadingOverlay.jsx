"use client";

export default function LoadingOverlay({ visible, text }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-[3px] bg-black/50">
      {/* Anillo animado alrededor del logo */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-44 w-44 rounded-full bg-[#006847]/30 animate-ping" />
        <span className="absolute inline-flex h-40 w-40 rounded-full border-4 border-[#DAA520]/60 border-t-transparent animate-spin" />
        <img
          src="/anam_logo.png"
          alt="ANAM"
          className="relative h-28 w-28 object-contain rounded-full logo-soft-bounce drop-shadow-[0_0_12px_rgba(218,165,32,0.7)]"
        />
      </div>

      {/* Texto */}
      <p className="mt-8 text-white font-semibold tracking-widest text-sm uppercase select-none">
        {text}
      </p>

      {/* Puntos animados centrados debajo del texto */}
      <span className="flex gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1s_ease-in-out_infinite_0ms]" />
        <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1s_ease-in-out_infinite_150ms]" />
        <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1s_ease-in-out_infinite_300ms]" />
      </span>
    </div>
  );
}
