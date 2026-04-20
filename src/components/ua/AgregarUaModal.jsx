"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, X, Trash2 } from "lucide-react";
import { NivelBadge } from "./NivelBadge";
import { API } from "./constants";

const EMPTY_FORM = { cd: "", nombre: "", nivel: "general" };

export function AgregarUaModal({ open, onClose, onSaved }) {
  const [pendingUas, setPendingUas] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleClose = () => {
    setPendingUas([]);
    setForm(EMPTY_FORM);
    setFormError(null);
    onClose();
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.cd.trim() || !form.nombre.trim()) {
      setFormError("El código y el nombre son obligatorios.");
      return;
    }
    if (pendingUas.some((ua) => ua.cd === form.cd.trim())) {
      setFormError("Ya existe una UA con ese código en la lista.");
      return;
    }
    setPendingUas((prev) => [...prev, { cd: form.cd.trim(), nombre: form.nombre.trim(), nivel: form.nivel }]);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  const handleRemove = (cd) => {
    setPendingUas((prev) => prev.filter((ua) => ua.cd !== cd));
  };

  const handleSave = async () => {
    if (pendingUas.length === 0) return;
    setSaving(true);
    try {
      const errors = [];
      for (const ua of pendingUas) {
        const res = await fetch(`${API}/api/cat_ua_unificada/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ua),
        });
        if (!res.ok) {
          const err = await res.json();
          errors.push(`${ua.cd}: ${JSON.stringify(err)}`);
        }
      }
      if (errors.length > 0) {
        setFormError(errors.join(" | "));
      } else {
        handleClose();
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-base">Catálogo de Unidades Administrativas</h2>
          <button onClick={handleClose} className="text-white/40 hover:text-white transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleAdd} className="px-6 py-4 border-b border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Nueva UA</p>
          <div className="flex gap-3 flex-wrap">
            <input
              name="cd"
              value={form.cd}
              onChange={handleFormChange}
              placeholder="Código"
              className="flex-1 min-w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
            />
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleFormChange}
              placeholder="Nombre de la unidad"
              className="flex-3 min-w-48 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
            />
            <Select
              value={form.nivel}
              onValueChange={(val) => { setForm((p) => ({ ...p, nivel: val })); setFormError(null); }}
            >
              <SelectTrigger className="min-w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Dirección General</SelectItem>
                <SelectItem value="operativa">Dirección Operativa</SelectItem>
                <SelectItem value="central">Dirección Central</SelectItem>
                <SelectItem value="area">Dirección de Área</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/40 hover:bg-[#DAA520]/30 shrink-0"
            >
              <Plus className="size-4" />
              Agregar
            </Button>
          </div>
          {formError && <p className="text-red-400 text-xs mt-2">{formError}</p>}
        </form>

        {/* Lista pendiente */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 bg-white/5 hover:bg-white/5">
                <TableHead className="text-[#DAA520] text-xs uppercase tracking-widest py-2 px-3">Código</TableHead>
                <TableHead className="text-[#DAA520] text-xs uppercase tracking-widest py-2 px-3">Nombre</TableHead>
                <TableHead className="text-[#DAA520] text-xs uppercase tracking-widest py-2 px-3">Nivel</TableHead>
                <TableHead className="py-2 px-3" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUas.map((ua) => (
                <TableRow key={ua.cd} className="border-b border-white/5 hover:bg-white/5">
                  <TableCell className="text-white font-mono text-sm py-2 px-3">{ua.cd}</TableCell>
                  <TableCell className="text-zinc-200 text-sm py-2 px-3">{ua.nombre}</TableCell>
                  <TableCell className="py-2 px-3"><NivelBadge nivel={ua.nivel} /></TableCell>
                  <TableCell className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleRemove(ua.cd)}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {pendingUas.length === 0 && (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={4} className="text-center text-white/30 py-6 text-sm italic">
                    Agrega unidades para registrarlas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <Button variant="ghost" onClick={handleClose} className="text-white/50 hover:text-red-400 hover:bg-transparent">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || pendingUas.length === 0}
            className="bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/40 hover:bg-[#DAA520]/30"
          >
            {saving && <Spinner className="size-4 mr-2" />}
            Guardar {pendingUas.length > 0 ? `(${pendingUas.length})` : ""}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
