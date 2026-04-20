"use client";
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Plus, UserPlus, X, BadgeCheck, Loader2, Mail } from "lucide-react"
import { API } from "@/components/ua/constants"
import { toast } from "sonner"

export default function AgregarTitular({ codigoUA, nombreUA, onSaved, fetchSinTitulares }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selected, setSelected] = useState(null);
    const [ccList, setCcList] = useState([]);
    const [ccInput, setCcInput] = useState("");
    const [loadingSave, setLoadingSave] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);
    const emailRef = useRef(null);

    // Cierra el dropdown al hacer clic fuera
    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Debounce + búsqueda
    useEffect(() => {
        if (!open) return;
        if (query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setLoadingSearch(true);
            try {
                const isNumeric = /^\d+/.test(query.trim());
                const param = isNumeric
                    ? `numempleado=${encodeURIComponent(query.trim())}`
                    : `nombres=${encodeURIComponent(query.trim())}`;
                const res = await fetch(`${API}/api/empleados_completos_sig/?${param}`);
                const data = await res.json();
                const list = data.results ?? data;
                setSuggestions(list.slice(0, 8));
                setShowDropdown(list.length > 0);
            } catch {
                setSuggestions([]);
                setShowDropdown(false);
            } finally {
                setLoadingSearch(false);
            }
        }, 350);

        return () => clearTimeout(debounceRef.current);
    }, [query, open]);


    const handleSave = async () => {
        if (!selected) return;
        setLoadingSave(true);
        try {
            const res = await fetch(`${API}/api/titulares_ua/agregar-titular/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    no_empleado: selected.numempleado,
                    cd_ua: codigoUA,
                    email: emailRef.current.value,
                    cc: ccList,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error ?? "Error al guardar el titular.");
                return;
            }
            toast.success("Titular agregado correctamente.");
            handleClose(false);
            onSaved();
            fetchSinTitulares();
        } catch {
            toast.error("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoadingSave(false);
        }
    };

    const handleSelect = (emp) => {
        setSelected(emp);
        setQuery(emp.nombres ?? "");
        setShowDropdown(false);
    };

    const handleClear = () => {
        setSelected(null);
        setQuery("");
        setSuggestions([]);
        setCcList([]);
        setCcInput("");
    };

    const addCc = () => {
        const email = ccInput.trim();
        if (!email || ccList.includes(email)) return;
        setCcList((prev) => [...prev, email]);
        setCcInput("");
    };

    const removeCc = (email) => setCcList((prev) => prev.filter((e) => e !== email));

    const handleClose = (val) => {
        setOpen(val);
        if (!val) handleClear();
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="cursor-pointer" onClick={() => setOpen(true)}>
                        <Plus />
                    </TooltipTrigger>
                    <TooltipContent>Agregar titular</TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent showCloseButton={false} className="sm:max-w-md bg-zinc-900 border border-white/10 text-white p-0 overflow-visible gap-0">

                    {/* Header */}
                    <div className="bg-linear-to-b from-zinc-800 to-zinc-900 px-6 pt-6 pb-5 border-b border-white/10 rounded-t-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#DAA520]/15 border border-[#DAA520]/25 flex items-center justify-center shrink-0">
                                <UserPlus className="w-5 h-5 text-[#DAA520]" />
                            </div>
                            <div>
                                <h2 className="text-white font-semibold text-base leading-tight">Agregar Titular</h2>
                                <p className="text-white/40 text-sm mt-0.5">
                                    <span className="text-[#DAA520]/80">{nombreUA}</span>
                                    <span className="text-white/30"> · {codigoUA}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="titular-busqueda" className="text-zinc-400 text-xs uppercase tracking-widest">
                                    Nombre completo o Número de Empleado
                                </Label>

                                {/* Search input + dropdown wrapper */}
                                <div ref={wrapperRef} className="relative mt-1.5">
                                    <div className="relative">
                                        <Input
                                            id="titular-busqueda"
                                            autoComplete="off"
                                            value={query}
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                                if (selected) setSelected(null);
                                            }}
                                            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                                            placeholder="Ej. García López o 123456789"
                                            className="bg-zinc-800/80 border-white/10 text-white placeholder:text-white/20 h-10 pr-8 focus-visible:border-[#DAA520]/40 focus-visible:ring-[#DAA520]/10"
                                        />
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30">
                                            {loadingSearch
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : query && <X className="w-4 h-4 cursor-pointer hover:text-white/60" onClick={handleClear} />
                                            }
                                        </div>
                                    </div>

                                    {/* Dropdown */}
                                    {showDropdown && suggestions.length > 0 && (
                                        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-zinc-800 shadow-xl overflow-hidden">
                                            {suggestions.map((emp, i) => (
                                                <li
                                                    key={emp.id ?? emp.numempleado ?? i}
                                                    onMouseDown={() => handleSelect(emp)}
                                                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-xs text-zinc-300 font-medium">
                                                        {emp.nombres?.charAt(0) ?? "?"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-white text-sm truncate">{emp.nombres ?? "—"}</p>
                                                        <p className="text-zinc-500 text-xs">{emp.numempleado} · {emp.personal_militar_o_civil ?? "—"}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </Field>

                            {/* Tarjeta del empleado seleccionado */}
                            {selected && (
                                <div className="mt-1 rounded-lg border border-[#DAA520]/20 bg-[#DAA520]/5 p-3 flex items-start gap-3">
                                    <BadgeCheck className="w-5 h-5 text-[#DAA520] shrink-0 mt-0.5" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white font-medium text-sm truncate">{selected.nombres}</p>
                                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-zinc-400">
                                            <span>Emp. <span className="text-zinc-300">{selected.numempleado ?? "—"}</span></span>
                                            <span>{selected.personal_militar_o_civil ?? "—"}</span>
                                            {selected.nombre_puesto_funcional && (
                                                <span className="truncate">{selected.nombre_puesto_funcional}</span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={handleClear} className="text-zinc-500 hover:text-white transition-colors shrink-0">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}

                            <Field className="mt-1">
                                <Label htmlFor="titular-email" className="text-zinc-400 text-xs uppercase tracking-widest">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="titular-email"
                                    name="email"
                                    type="email"
                                    ref={emailRef}
                                    placeholder="correo@institución.gob.mx"
                                    className="mt-1.5 bg-zinc-800/80 border-white/10 text-white placeholder:text-white/20 h-10 focus-visible:border-[#DAA520]/40 focus-visible:ring-[#DAA520]/10"
                                />
                            </Field>

                            <Field className="mt-1">
                                <Label className="text-zinc-400 text-xs uppercase tracking-widest">
                                    CC — Con copia a
                                </Label>
                                <div className="mt-1.5 flex gap-2">
                                    <Input
                                        type="email"
                                        value={ccInput}
                                        onChange={(e) => setCcInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCc())}
                                        placeholder="correo@institución.gob.mx"
                                        className="bg-zinc-800/80 border-white/10 text-white placeholder:text-white/20 h-10 focus-visible:border-[#DAA520]/40 focus-visible:ring-[#DAA520]/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCc}
                                        className="shrink-0 h-10 w-10 rounded-lg border border-white/10 bg-zinc-800 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {ccList.length > 0 && (
                                    <div className="mt-2 rounded-lg border border-white/10 overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-white/10 bg-zinc-800/60">
                                                    <th className="text-left px-3 py-2 text-zinc-500 text-xs font-medium uppercase tracking-wider">
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Correo</span>
                                                    </th>
                                                    <th className="w-8" />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ccList.map((email) => (
                                                    <tr key={email} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                                                        <td className="px-3 py-2 text-zinc-300">{email}</td>
                                                        <td className="px-2 py-2 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeCc(email)}
                                                                className="text-zinc-600 hover:text-red-400 transition-colors"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Field>
                        </FieldGroup>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-2 rounded-b-xl">
                        <DialogClose render={<Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/8" />}>
                            Cancelar
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={!selected || loadingSave}
                            onClick={handleSave}
                            className="bg-[#DAA520] text-zinc-900 font-semibold hover:bg-[#c4941a] px-5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loadingSave
                                ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Guardando...</>
                                : "Guardar"
                            }
                        </Button>
                    </div>

                </DialogContent>
            </Dialog>
        </>
    )
}
