"use client";

import { Fade } from "react-awesome-reveal";
import { useState } from "react";
import EstadisticaMes from "./EstadisticaMes";

export const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const todayMonth = new Date().getMonth();
const AVAILABLE_MONTHS = Array.from({ length: todayMonth + 1 }, (_, index) => ({
  value: index,
  label: MONTH_NAMES[index],
}));

export default function EstadisticasContinuidades() {
  const [subTab, setSubTab] = useState(todayMonth);

  return (
    <Fade>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(10,17,14,0.9),rgba(24,28,31,0.82))] p-5 shadow-[0_16px_42px_rgba(0,0,0,0.18)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#DAA520]/70">
                Periodo de consulta
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Selecciona el mes a analizar
              </h3>
              <p className="mt-1 text-sm text-white/54">
                El panel se actualiza con el resumen y detalle del mes elegido.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_MONTHS.map((month) => (
                <button
                  key={month.value}
                  type="button"
                  onClick={() => setSubTab(month.value)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    subTab === month.value
                      ? "bg-[#DAA520]/16 text-white ring-1 ring-[#DAA520]/25 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
                      : "border border-white/8 bg-white/[0.03] text-white/55 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {month.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <EstadisticaMes mes={subTab} />
      </div>
    </Fade>
  );
}
