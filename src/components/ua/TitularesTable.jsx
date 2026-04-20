import { useState } from "react";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { NivelBadge } from "./NivelBadge";
import { Pencil, Trash2, Search } from "lucide-react";
import AgregarTitular from "../AgregarTitular";
import EditarTitular from "../EditarTitular";
import { API } from "./constants";
import { toast } from "sonner";

const NIVEL_FILTERS = [
  { value: "general", label: "General", active: "bg-[#006847]/30 text-[#00a86b] border-[#006847]/60", idle: "bg-white/5 text-white/40 border-white/10 hover:border-[#006847]/40 hover:text-[#00a86b]" },
  { value: "operativa", label: "Operativa", active: "bg-purple-900/40 text-purple-400 border-purple-700/60", idle: "bg-white/5 text-white/40 border-white/10 hover:border-purple-700/40 hover:text-purple-400" },
  { value: "central", label: "Central", active: "bg-[#DAA520]/20 text-[#DAA520] border-[#DAA520]/50", idle: "bg-white/5 text-white/40 border-white/10 hover:border-[#DAA520]/40 hover:text-[#DAA520]" },
  { value: "area", label: "Área", active: "bg-blue-900/40 text-blue-400 border-blue-700/60", idle: "bg-white/5 text-white/40 border-white/10 hover:border-blue-700/40 hover:text-blue-400" },
];

export function TitularesTable({ data, sinTitulares, onSaved, fetchSinTitulares }) {
  const [query, setQuery] = useState("");
  const [activeNiveles, setActiveNiveles] = useState(new Set());
  const [editingRow, setEditingRow] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const toggleNivel = (val) =>
    setActiveNiveles((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });

  const q = query.trim().toLowerCase();
  const filteredData = data.filter((r) => {
    const matchQ = !q || r.cd_ua?.toLowerCase().includes(q) || r.ua_nombre?.toLowerCase().includes(q) || r.titular_nombre?.toLowerCase().includes(q);
    const matchN = activeNiveles.size === 0 || activeNiveles.has(r.ua_nivel);
    return matchQ && matchN;
  });
  const filteredSin = sinTitulares.filter((r) => {
    const matchQ = !q || r.cd?.toLowerCase().includes(q) || r.nombre?.toLowerCase().includes(q);
    const matchN = activeNiveles.size === 0 || activeNiveles.has(r.nivel);
    return matchQ && matchN;
  });

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeletingId(pendingDelete.id);
    try {
      const res = await fetch(`${API}/api/titulares_ua/${pendingDelete.id}/`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Titular eliminado.");
        onSaved();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? "Error al eliminar.");
      }
    } catch {
      toast.error("Error de conexión.");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por código, dirección o titular…"
            className="w-80 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
          />
        </div>
        {NIVEL_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => toggleNivel(f.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${activeNiveles.has(f.value) ? f.active : f.idle}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-white/10">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10 bg-white/5 hover:bg-white/5">
              {["Código", "Unidad Administrativa", "Nivel", "Titular", "Correo Electrónico", "CC", ""].map((h, i) => (
                <TableHead key={i} className="text-[#DAA520] font-semibold text-xs uppercase tracking-widest py-3 px-4">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, i) => (
              <TableRow
                key={row.id}
                className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5 ${i % 2 === 0 ? "bg-transparent" : "bg-white/2"}`}
              >
                <TableCell className="text-white font-medium py-3 px-4">{row.cd_ua}</TableCell>
                <TableCell className="text-zinc-100 font-semibold py-3 px-4">{row.ua_nombre ?? "—"}</TableCell>
                <TableCell className="py-3 px-4">
                  {row.ua_nivel ? <NivelBadge nivel={row.ua_nivel} /> : "—"}
                </TableCell>
                <TableCell className="text-zinc-300 py-3 px-4">
                  {row.titular_nombre ?? <span className="text-white/30 italic">Sin titular</span>}
                </TableCell>
                <TableCell className="text-zinc-100 font-semibold py-3 px-4">{row.email ?? "—"}</TableCell>
                <TableCell className="text-zinc-100 py-3 px-4">
                  {Array.isArray(row.cc) && row.cc.length > 0
                    ? row.cc.join(", ")
                    : <span className="text-white/30 italic">Sin CC</span>}
                </TableCell>
                <TableCell className="py-3 px-4">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              onClick={() => setEditingRow(row)}
                              className="text-white/30 hover:text-[#DAA520] transition-colors"
                            />
                          }
                        >
                          <Pencil className="size-4" />
                        </TooltipTrigger>
                        <TooltipContent>Editar titular</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              onClick={() => setPendingDelete(row)}
                              disabled={deletingId === row.id}
                              className="text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                            />
                          }
                        >
                          {deletingId === row.id
                            ? <Spinner className="size-4" />
                            : <Trash2 className="size-4" />}
                        </TooltipTrigger>
                        <TooltipContent>Eliminar titular</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-white/40 py-8">
                  {q ? "Sin resultados para la búsqueda." : "No hay titulares registrados."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {filteredSin.length > 0 && (
        <h1 className="text-white/60 py-5 text-xl">Unidades Administrativas sin titulares asignados</h1>
      )}

      {filteredSin.length > 0 && (
        <div className="w-full rounded-xl overflow-hidden border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-white/5 hover:bg-white/5">
                {["Código", "Unidad Administrativa", "Nivel", "Titular", "Correo Electrónico", "CC", "Acciones"].map((h) => (
                  <TableHead key={h} className="text-[#DAA520] font-semibold text-xs uppercase tracking-widest py-3 px-4">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSin.map((row, i) => (
                <TableRow
                  key={row.cd}
                  className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5 ${i % 2 === 0 ? "bg-transparent" : "bg-white/2"}`}
                >
                  <TableCell className="text-white font-medium py-3 px-4">{row.cd}</TableCell>
                  <TableCell className="text-zinc-100 font-semibold py-3 px-4">{row.nombre ?? "—"}</TableCell>
                  <TableCell className="py-3 px-4">
                    {row.nivel ? <NivelBadge nivel={row.nivel} /> : "—"}
                  </TableCell>
                  <TableCell className="text-zinc-300 py-3 px-4">
                    <span className="text-white/30 italic">Sin titular</span>
                  </TableCell>
                  <TableCell className="text-zinc-100 font-semibold py-3 px-4">
                    <span className="text-white/30 italic">—</span>
                  </TableCell>
                  <TableCell className="text-zinc-100 py-3 px-4">
                    <span className="text-white/30 italic">—</span>
                  </TableCell>
                  <TableCell className="text-zinc-100 py-3 px-4 flex justify-center items-center">
                    <AgregarTitular fetchSinTitulares={fetchSinTitulares} codigoUA={row.cd} nombreUA={row.nombre} nivelUA={row.nivel} onSaved={onSaved} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EditarTitular
        titular={editingRow}
        open={!!editingRow}
        onClose={() => setEditingRow(null)}
        onSaved={() => { setEditingRow(null); onSaved(); }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={!!deletingId}
        title="¿Eliminar titular?"
        description={pendingDelete ? `Se eliminará a "${pendingDelete.titular_nombre}" como titular de "${pendingDelete.ua_nombre}".` : ""}
      />
    </>
  );
}
