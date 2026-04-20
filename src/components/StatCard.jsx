const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="flex items-center gap-3 rounded-xl bg-black/20 p-4 ring-1 ring-white/10">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/60">{label}</p>
    </div>
  </div>
);

export default StatCard;
