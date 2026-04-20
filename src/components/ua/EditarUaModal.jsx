"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { X } from "lucide-react";
import { API } from "./constants";

export function EditarUaModal({ ua, open, onClose, onSaved }) {
  const [form, setForm] = useState({ nombre: "", nivel: "general" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ua) {
      setForm({ nombre: ua.nombre, nivel: ua.nivel });
      setError(null);
    }
  }, [ua]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/cat_ua_unificada/${ua.cd}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(JSON.stringify(err));
      } else {
        onSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!open || !ua) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-white font-semibold text-base">Editar Unidad Administrativa</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="size-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Código</p>
            <p className="text-white font-mono text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2">
              {ua.cd}
            </p>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Nombre</p>
            <input
              value={form.nombre}
              onChange={(e) => { setForm((p) => ({ ...p, nombre: e.target.value })); setError(null); }}
              placeholder="Nombre de la unidad"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#DAA520]/60"
            />
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Nivel</p>
            <Select
              value={form.nivel}
              onValueChange={(val) => { setForm((p) => ({ ...p, nivel: val })); setError(null); }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Dirección General</SelectItem>
                <SelectItem value="operativa">Dirección Operativa</SelectItem>
                <SelectItem value="central">Dirección Central</SelectItem>
                <SelectItem value="area">Dirección de Área</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white/50 hover:text-red-400 hover:bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#DAA520]/20 text-[#DAA520] border border-[#DAA520]/40 hover:bg-[#DAA520]/30"
            >
              {saving && <Spinner className="size-4 mr-2" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
