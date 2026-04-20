import { NIVEL_LABELS, NIVEL_STYLES } from "./constants";

export function NivelBadge({ nivel }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${NIVEL_STYLES[nivel] ?? ""}`}>
      {NIVEL_LABELS[nivel] ?? nivel}
    </span>
  );
}
