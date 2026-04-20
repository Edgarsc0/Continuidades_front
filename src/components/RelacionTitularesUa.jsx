"use client";

import { useEffect, useState, useCallback } from "react";
import { Fade } from "react-awesome-reveal";
import { Spinner } from "@/components/ui/spinner";
import { TitularesTable } from "./ua/TitularesTable";
import { CatalogoUaTab } from "./ua/CatalogoUaTab";
import { OrganigramaTab } from "./ua/OrganigramaTab";
import { AgregarUaModal } from "./ua/AgregarUaModal";
import { API, SUB_TABS } from "./ua/constants";

export default function RelacionTitularesUa() {
  const [subTab, setSubTab] = useState("titulares");
  const [modalOpen, setModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [catUas, setCatUas] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catFetched, setCatFetched] = useState(false);

  const [uasSinTitularesFetched, setUasSinTitularesFetched] = useState(false);
  const [uasSinTitulares, setUasSinTitulares] = useState([]);
  const [uasSinTitularesLoading, setUasSinTitularesLoading] = useState(false);

  const fetchTitulares = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/titulares_ua/`);
    setData(await res.json());
    setLoading(false);
  }, []);

  const fetchUasSinTitulares = useCallback(async () => {
    setUasSinTitularesLoading(true);
    const res = await fetch(`${API}/api/titulares_ua/uas-sin-titulares/`);
    setUasSinTitulares(await res.json());
    setUasSinTitularesLoading(false);
  }, []);

  const fetchCatUas = useCallback(async () => {
    setCatLoading(true);
    const res = await fetch(`${API}/api/cat_ua_unificada/`);
    setCatUas(await res.json());
    setCatLoading(false);
    setCatFetched(true);
  }, []);

  useEffect(() => { fetchTitulares(); }, [fetchTitulares]);

  useEffect(() => {
    if ((subTab === "catalogo" || subTab === "organigrama") && !catFetched) fetchCatUas();
  }, [subTab, catFetched, fetchCatUas]);

  useEffect(() => {
    if (subTab === "titulares" && !uasSinTitularesFetched) fetchUasSinTitulares();
  }, [subTab, uasSinTitularesFetched, fetchUasSinTitulares]);

  const handleSaved = () => {
    setCatFetched(false);
    fetchCatUas();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-full min-h-100">
        <Spinner className="size-12 text-white/60" />
        <p className="text-white/60 text-sm">Obteniendo la relación de UAs con titulares</p>
      </div>
    );
  }

  return (
    <>
      <Fade>
        <div>
          <div className="flex gap-1 mb-5">
            {SUB_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setSubTab(t.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${subTab === t.value ? "bg-zinc-800 text-white" : "text-white/50 hover:text-white"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {subTab === "titulares" && <TitularesTable data={data} sinTitulares={uasSinTitulares} onSaved={fetchTitulares} fetchSinTitulares={fetchUasSinTitulares} />}
          {subTab === "catalogo" && (
            <CatalogoUaTab
              catUas={catUas}
              catLoading={catLoading}
              onOpenModal={() => setModalOpen(true)}
              onRefresh={fetchCatUas}
            />
          )}
          {subTab === "organigrama" && (
            <OrganigramaTab catUas={catUas} catLoading={catLoading} />
          )}
        </div>
      </Fade>

      <AgregarUaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </>
  );
}
