export default function PageBackground({ children, className = "" }) {
  return (
    <div
      className={`relative min-h-screen bg-zinc-950 ${className}`}
    >
      {/* Cuadrícula */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Destello verde ANAM en la parte superior */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(0,104,71,0.15)_0%,transparent_70%)]" />
      {/* Contenido */}
      <div className="relative">{children}</div>
    </div>
  );
}
