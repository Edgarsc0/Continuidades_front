const TabPanel = ({ title, subtitle, gradient, content }) => (
  <div
    className={`relative w-full rounded-2xl p-8 ${gradient}`}
  >
    {/* Glow de fondo */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-xl" />
    </div>

    <div className="relative">
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60">{subtitle}</p>

      <div className="mt-6 w-full">
        {content}
      </div>
    </div>
  </div>
);

export default TabPanel;
