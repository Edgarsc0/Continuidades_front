"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { NivelBadge } from "./NivelBadge";
import { EditarUaModal } from "./EditarUaModal";
import { API, NIVEL_LABELS } from "./constants";

const NIVEL_FILTERS = [
  { value: "general",   label: "General",   active: "bg-[#006847]/30 text-[#00a86b] border-[#006847]/60",    idle: "bg-white/5 text-white/40 border-white/10 hover:border-[#006847]/40 hover:text-[#00a86b]" },
  { value: "operativa", label: "Operativa", active: "bg-purple-900/40 text-purple-400 border-purple-700/60", idle: "bg-white/5 text-white/40 border-white/10 hover:border-purple-700/40 hover:text-purple-400" },
  { value: "central",   label: "Central",   active: "bg-[#DAA520]/20 text-[#DAA520] border-[#DAA520]/50",    idle: "bg-white/5 text-white/40 border-white/10 hover:border-[#DAA520]/40 hover:text-[#DAA520]" },
  { value: "area",      label: "Área",      active: "bg-blue-900/40 text-blue-400 border-blue-700/60",       idle: "bg-white/5 text-white/40 border-white/10 hover:border-blue-700/40 hover:text-blue-400" },
];

export function CatalogoUaTab({ catUas, catLoading, onOpenModal, onRefresh }) {
  const [editingUa, setEditingUa] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingCd, setDeletingCd] = useState(null);
  const [query, setQuery] = useState("");
  const [activeNiveles, setActiveNiveles] = useState(new Set());

  const toggleNivel = (val) =>
    setActiveNiveles((prev) => {
      const next = new Set(prev);
      next.has(val) ? next.delete(val) : next.add(val);
      return next;
    });

  const filtered = catUas.filter((ua) => {
    const q = query.trim().toLowerCase();
    const matchQuery = !q || (
      ua.cd.toLowerCase().includes(q) ||
      ua.nombre.toLowerCase().includes(q) ||
      (NIVEL_LABELS[ua.nivel] ?? ua.nivel).toLowerCase().includes(q)
    );
    const matchNivel = activeNiveles.size === 0 || activeNiveles.has(ua.nivel);
    return matchQuery && matchNivel;
  });

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    setDeletingCd(pendingDelete.cd);
    try {
      await fetch(`${API}/api/cat_ua_unificada/${pendingDelete.cd}/`, { method: "DELETE" });
      onRefresh();
    } finally {
      setDeletingCd(null);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/30 pointer-events-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar…"
              className="w-100 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
            />
          </div>
          {NIVEL_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => toggleNivel(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                activeNiveles.has(f.value) ? f.active : f.idle
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Button
          onClick={onOpenModal}
          className="gap-2 bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/40 hover:bg-[#DAA520]/30 shrink-0"
        >
          <Plus className="size-4" />
          Agregar Unidades Administrativas
        </Button>
      </div>

      {catLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Spinner className="size-10 text-white/60" />
          <p className="text-white/50 text-sm">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="w-full rounded-xl overflow-hidden border border-white/10">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-white/5 hover:bg-white/5">
                {["Código", "Nombre", "Nivel"].map((h) => (
                  <TableHead key={h} className="text-[#DAA520] font-semibold text-xs uppercase tracking-widest py-3 px-4">
                    {h}
                  </TableHead>
                ))}
                <TableHead className="py-3 px-4 w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ua, i) => (
                <TableRow
                  key={ua.cd}
                  className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5 ${i % 2 === 0 ? "bg-transparent" : "bg-white/2"}`}
                >
                  <TableCell className="text-white font-mono font-medium py-3 px-4">{ua.cd}</TableCell>
                  <TableCell className="text-zinc-100 font-semibold py-3 px-4">{ua.nombre}</TableCell>
                  <TableCell className="py-3 px-4">
                    <NivelBadge nivel={ua.nivel} />
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <TooltipProvider>
                      <div className="flex items-center justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <button
                                onClick={() => setEditingUa(ua)}
                                className="text-white/30 hover:text-[#DAA520] transition-colors"
                              />
                            }
                          >
                            <Pencil className="size-4" />
                          </TooltipTrigger>
                          <TooltipContent>Editar unidad</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <button
                                onClick={() => setPendingDelete(ua)}
                                disabled={deletingCd === ua.cd}
                                className="text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                              />
                            }
                          >
                            {deletingCd === ua.cd
                              ? <Spinner className="size-4" />
                              : <Trash2 className="size-4" />}
                          </TooltipTrigger>
                          <TooltipContent>Eliminar unidad</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-white/40 py-8">
                    {query || activeNiveles.size > 0 ? "Sin resultados para los filtros aplicados." : "No hay unidades administrativas registradas."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <EditarUaModal
        ua={editingUa}
        open={!!editingUa}
        onClose={() => setEditingUa(null)}
        onSaved={() => { setEditingUa(null); onRefresh(); }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={!!deletingCd}
        title="¿Eliminar unidad administrativa?"
        description={pendingDelete ? `"${pendingDelete.nombre}" (${pendingDelete.cd}) será eliminada permanentemente.` : ""}
      />
    </>
  );
}
