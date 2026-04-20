"use client";

import { Tabs } from "./ui/tabs";
import {
  FileCheck2,
  Clock,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import TabPanel from "./TabPanel";
import RelacionTitularesUa from "./RelacionTitularesUa";
import EstadisticasContinuidades from "./EstadisticasContinuidades";
import FormulariosContinuidad from "./FormulariosContinuidad";

export function TabsDashboard() {

  const year = new Date().getFullYear();

  const tabs = [
    {
      title: "Relación de Unidades Administrativas con Titulares",
      value: "relacion-uas-titulares",
      content: (
        <TabPanel
          title="Relación de Unidades Administrativas con Titulares"
          subtitle="Vista general de todas las unidades administrativas con sus respectivos titulares y medios de contacto"
          gradient="bg-gradient-to-br from-zinc-900 to-[#0b1a13]"
          content={<RelacionTitularesUa />}
        />
      ),
    },
    {
      title: "Estadisticas",
      value: "estadisticas",
      content: (
        <TabPanel
          title={`Estadisticas de Continuidades del año ${year}`}
          subtitle="En este panel podras visualizar por mes y por quincena la cantidad de continuidades temporales y definitivas registradas."
          gradient="bg-gradient-to-br from-[#0b1a13] to-zinc-900"
          content={<EstadisticasContinuidades />}
        />
      ),
    },
    {
      title: "Formularios de Continuidad",
      value: "pendientes",
      content: (
        <TabPanel
          title="Formularios de Continuidad"
          subtitle="Habilita los formularios de continuidad para que los titulares puedan contestar y subir su reporte de continuidad."
          gradient="bg-gradient-to-br from-[#0b1a13] to-zinc-900"
          content={<FormulariosContinuidad />}
        />
      ),
    },
    {
      title: "Cerradas",
      value: "cerradas",
      content: (
        <TabPanel
          title="Continuidades Cerradas"
          subtitle="Procesos completados y archivados"
          gradient="bg-gradient-to-br from-zinc-900 to-zinc-950"
          stats={[
            {
              label: "Completadas",
              value: "194",
              icon: CheckCircle2,
              color: "bg-zinc-700/60 text-zinc-300",
            },
            {
              label: "Rechazadas",
              value: "18",
              icon: XCircle,
              color: "bg-red-900/40 text-red-400",
            },
            {
              label: "Total archivadas",
              value: "212",
              icon: FileCheck2,
              color: "bg-zinc-700/60 text-zinc-300",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="relative mt-10 flex w-full flex-col">
      <Tabs
        tabs={tabs}
        tabClassName="text-zinc-400 hover:text-white text-sm transition-colors duration-200"
        activeTabClassName="bg-zinc-800 ring-1 ring-zinc-700"
      />
    </div>
  );
}
