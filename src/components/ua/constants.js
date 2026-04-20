export const API = process.env.NEXT_PUBLIC_API_URL;

export const NIVEL_LABELS = {
  general: "Dirección General",
  operativa: "Dirección Operativa",
  central: "Dirección Central",
  area: "Dirección de Área",
};

export const NIVEL_STYLES = {
  general: "bg-[#006847]/20 text-[#00a86b] border border-[#006847]/40",
  operativa: "bg-purple-900/30 text-purple-400 border border-purple-800/40",
  central: "bg-[#DAA520]/15 text-[#DAA520] border border-[#DAA520]/30",
  area: "bg-blue-900/30 text-blue-400 border border-blue-800/40",
};

export const SUB_TABS = [
  { value: "titulares", label: "Titulares por UA" },
  { value: "catalogo", label: "Catálogo de UAs" },
  { value: "organigrama", label: "Organigrama" },
];
