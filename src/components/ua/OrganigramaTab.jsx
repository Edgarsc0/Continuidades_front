"use client";
import { useState, useMemo, useRef, useCallback, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, Download, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import { NIVEL_LABELS } from "./constants";
import { Spinner } from "@/components/ui/spinner";

const ExpandCtx = createContext({ signal: 0, mode: null });

// ─── Lógica de jerarquía ───────────────────────────────────────────────────

function findParentCd(ua, all) {
  const { cd, nivel } = ua;
  if (cd === "001") return null;
  if (nivel === "general") return "001";

  if (nivel === "operativa") {
    // DO: padre es el código X00 donde X es el primer dígito (ej. 909 → 900)
    const parentCd = cd[0] + "00";
    const parent = all.find(u => u.cd === parentCd);
    return parent?.cd ?? "001";
  }

  if (nivel === "central") {
    // DC: padre = primeros 3 dígitos (ej. 90001 → 900)
    const prefix = cd.slice(0, 3);
    return all.find(u => u.cd === prefix)?.cd ?? "001";
  }

  if (nivel === "area") {
    // Excepción aduanas: 101-150 → DG 100
    const num = parseInt(cd, 10);
    if (!isNaN(num) && num >= 101 && num <= 150) return "100";

    // DA normal: busca DC (primeros 5 dígitos para códigos ≥ 7 chars)
    if (cd.length >= 7) {
      const dcCd = cd.slice(0, 5);
      if (all.find(u => u.cd === dcCd)) return dcCd;
    }

    // Fallback: DG (primeros 3 dígitos)
    const dgCd = cd.slice(0, 3);
    if (all.find(u => u.cd === dgCd)) return dgCd;

    return "001";
  }

  return "001";
}

function buildTree(uas) {
  if (!uas?.length) return null;
  const map = Object.fromEntries(uas.map(u => [u.cd, { ...u, children: [] }]));

  uas.forEach(ua => {
    if (ua.cd === "001") return;
    const pCd = findParentCd(ua, uas);
    if (pCd && map[pCd]) {
      map[pCd].children.push(map[ua.cd]);
    } else if (map["001"]) {
      map["001"].children.push(map[ua.cd]);
    }
  });

  Object.values(map).forEach(n => n.children.sort((a, b) => a.cd.localeCompare(b.cd)));
  return map["001"] ?? null;
}

// ─── Estilos por nivel ─────────────────────────────────────────────────────

const NIVEL_UI = {
  general: { card: "border-[#006847]/50 bg-[#006847]/15", code: "text-[#00a86b]" },
  operativa: { card: "border-purple-700/50 bg-purple-900/20", code: "text-purple-400" },
  central: { card: "border-[#DAA520]/40 bg-[#DAA520]/10", code: "text-[#DAA520]" },
  area: { card: "border-blue-700/40 bg-blue-900/15", code: "text-blue-400" },
};

const CONNECTOR = "rgba(255,255,255,0.13)";
const CONN_H = 24;

// ─── Tarjeta de nodo ───────────────────────────────────────────────────────

function NodeCard({ node, open, onToggle }) {
  const ui = NIVEL_UI[node.nivel] ?? NIVEL_UI.general;
  const hasChildren = node.children.length > 0;

  return (
    <button
      onClick={hasChildren ? onToggle : undefined}
      className={`
        rounded-xl border px-3 pt-2.5 pb-2 w-44 text-left outline-none
        transition-all duration-150 select-none
        ${ui.card}
        ${hasChildren ? "cursor-pointer hover:brightness-125 active:scale-95" : "cursor-default"}
      `}
    >
      <p className={`text-[10px] font-bold font-mono tracking-wider ${ui.code}`}>{node.cd}</p>
      <p className="text-white/90 text-xs font-medium leading-snug mt-0.5 line-clamp-2">
        {node.nombre}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className={`text-[9px] uppercase tracking-wider ${ui.code} opacity-70`}>
          {NIVEL_LABELS[node.nivel] ?? node.nivel}
        </span>
        {hasChildren && (
          <span className={`${ui.code} opacity-60 flex items-center gap-0.5`}>
            <span className="text-[9px]">{node.children.length}</span>
            {open
              ? <ChevronUp className="w-2.5 h-2.5" />
              : <ChevronDown className="w-2.5 h-2.5" />}
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Nodo del árbol ────────────────────────────────────────────────────────

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children.length > 0;
  const isOnly = node.children.length === 1;
  const { signal, mode } = useContext(ExpandCtx);

  useEffect(() => {
    if (!mode) return;
    setOpen(mode === "expand");
  }, [signal]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <NodeCard node={node} open={open} onToggle={() => setOpen(o => !o)} />

      <AnimatePresence initial={false}>
        {open && hasChildren && (
          <motion.div
            key="ch"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            {/* Línea vertical desde el padre */}
            <div style={{ width: 1, height: CONN_H, background: CONNECTOR }} />

            {/* Fila de hijos */}
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {node.children.map((child, i) => {
                const isFirst = i === 0;
                const isLast = i === node.children.length - 1;

                return (
                  <div
                    key={child.cd}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingLeft: 8, paddingRight: 8 }}
                  >
                    {/* Segmento conector */}
                    <div style={{ position: "relative", width: "100%", height: CONN_H }}>
                      {/* Barra horizontal */}
                      {!isOnly && (
                        <div style={{
                          position: "absolute",
                          top: 0,
                          left: isFirst ? "50%" : 0,
                          right: isLast ? "50%" : 0,
                          height: 1,
                          background: CONNECTOR,
                        }} />
                      )}
                      {/* Línea vertical hacia abajo */}
                      <div style={{
                        position: "absolute",
                        top: 0, bottom: 0,
                        left: "50%",
                        width: 1,
                        background: CONNECTOR,
                        transform: "translateX(-50%)",
                      }} />
                    </div>

                    <TreeNode node={child} depth={depth + 1} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Leyenda ───────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {Object.entries(NIVEL_UI).map(([key, ui]) => (
        <div key={key} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded border ${ui.card}`} />
          <span className="text-xs text-white/40">{NIVEL_LABELS[key]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

export function OrganigramaTab({ catUas, catLoading }) {
  const tree = useMemo(() => buildTree(catUas), [catUas]);
  const containerRef = useRef(null);
  const treeRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });
  const [exporting, setExporting] = useState(false);
  const [expandCtx, setExpandCtx] = useState({ signal: 0, mode: null });

  const handleExpandAll = useCallback(() => {
    setExpandCtx(prev => ({ signal: prev.signal + 1, mode: "expand" }));
  }, []);

  const handleCollapseAll = useCallback(() => {
    setExpandCtx(prev => ({ signal: prev.signal + 1, mode: "collapse" }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!treeRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(treeRef.current, {
        backgroundColor: "#09090b",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "organigrama-anam.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = containerRef.current;
    drag.current = { active: true, startX: e.pageX, startY: e.pageY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!drag.current.active) return;
    const el = containerRef.current;
    el.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
    el.scrollTop = drag.current.scrollTop - (e.pageY - drag.current.startY);
  }, []);

  const onMouseUp = useCallback(() => {
    drag.current.active = false;
    const el = containerRef.current;
    if (el) { el.style.cursor = "grab"; el.style.userSelect = ""; }
  }, []);

  if (catLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="size-8 text-white/40" />
      </div>
    );
  }

  if (!tree) {
    return (
      <p className="text-center text-white/30 text-sm py-20">
        Agrega unidades administrativas para ver el organigrama.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Legend />
        <div className="flex items-center gap-2">
          {/* Expandir todo */}
          <motion.button
            onClick={handleExpandAll}
            whileTap={{ scale: 0.93 }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium overflow-hidden border border-[#006847]/40 text-[#00a86b] bg-[#006847]/10 hover:bg-[#006847]/25 transition-colors"
          >
            <motion.span
              key={expandCtx.signal + "-exp"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,168,107,0.25) 0%, transparent 70%)" }}
            />
            <ChevronsUpDown className="size-4 relative" />
            <span className="relative">Expandir todo</span>
          </motion.button>

          {/* Colapsar todo */}
          <motion.button
            onClick={handleCollapseAll}
            whileTap={{ scale: 0.93 }}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium overflow-hidden border border-white/10 text-white/60 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronsDownUp className="size-4" />
            <span>Colapsar todo</span>
          </motion.button>

          {/* Botón exportar */}
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-medium transition-all disabled:opacity-40"
          >
            {exporting ? <Spinner className="size-4" /> : <Download className="size-4" />}
            {exporting ? "Exportando…" : "Exportar"}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-auto rounded-xl border border-white/10 bg-zinc-950/50 p-8"
        style={{ minHeight: "20rem", cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <ExpandCtx.Provider value={expandCtx}>
          <div ref={treeRef} style={{ display: "inline-flex", justifyContent: "center", minWidth: "100%", padding: "2rem" }}>
            <TreeNode node={tree} depth={0} />
          </div>
        </ExpandCtx.Provider>
      </div>
      <p className="text-white/20 text-xs mt-2 text-center">
        Haz clic en un nodo para expandir o colapsar sus dependencias.
      </p>
    </div>
  );
}
