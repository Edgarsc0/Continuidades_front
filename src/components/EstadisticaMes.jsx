"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    BarChart3,
    Building2,
    ClipboardList,
    TrendingUp,
} from "lucide-react";
import { MONTH_NAMES } from "./EstadisticasContinuidades";

const COLORS = {
    temporales: "#8b5cf6",
    definitivos: "#10b981",
    total: "#22c3ee",
};

const METRIC_META = {
    temporales: {
        label: "Temporales",
        color: COLORS.temporales,
        activeClass: "bg-violet-500/15 text-violet-100 ring-1 ring-violet-400/25",
    },
    definitivos: {
        label: "Definitivos",
        color: COLORS.definitivos,
        activeClass: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/25",
    },
    total: {
        label: "Total",
        color: COLORS.total,
        activeClass: "bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/25",
    },
};

function formatNumber(value) {
    return new Intl.NumberFormat("es-MX").format(value ?? 0);
}

function SummaryCard({ icon: Icon, label, value, accentClass = "text-white" }) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">
                        {label}
                    </p>
                    <p className={`mt-3 text-3xl font-semibold ${accentClass}`}>{value}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-white/60 ring-1 ring-white/8">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function StatPill({ label, value, className = "" }) {
    return (
        <div className={`rounded-2xl p-4 ${className}`}>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatNumber(value)}</p>
        </div>
    );
}

function DistributionRow({ label, value, total, color }) {
    const percent = total > 0 ? (value / total) * 100 : 0;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-white/72">{label}</span>
                </div>
                <div className="shrink-0 text-right">
                    <span className="text-sm font-semibold text-white">
                        {formatNumber(value)}
                    </span>
                    <span className="ml-2 text-xs text-white/45">{percent.toFixed(0)}%</span>
                </div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/6">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${Math.max(percent, value > 0 ? 8 : 0)}%`,
                        backgroundColor: color,
                        opacity: 0.95,
                    }}
                />
            </div>
        </div>
    );
}

function QuincenaCard({ titulo, datos, fechas }) {
    const total = datos?.total ?? 0;
    const temporales = datos?.temporales ?? 0;
    const definitivos = datos?.definitivos ?? 0;
    const chartData = [
        {
            name: "Temporales",
            value: temporales,
            color: COLORS.temporales,
        },
        {
            name: "Definitivos",
            value: definitivos,
            color: COLORS.definitivos,
        },
    ];

    const fechasQuincena = Array.isArray(fechas) ? fechas.filter(Boolean) : [];

    return (
        <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(11,18,15,0.88),rgba(24,28,31,0.82))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#DAA520]/70">
                        Resumen quincenal
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{titulo}</h3>
                    <p className="mt-1 text-sm text-white/52">
                        Distribucion de continuidades temporales y definitivas.
                    </p>
                </div>

                <div className="flex max-w-full flex-wrap gap-2 xl:justify-end">
                    {fechasQuincena.length > 0 ? (
                        fechasQuincena.map((fecha) => (
                            <span
                                key={fecha}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                            >
                                {fecha}
                            </span>
                        ))
                    ) : (
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                            Sin fechas registradas
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    <StatPill
                        label="Total"
                        value={total}
                        className="border border-white/8 bg-white/[0.04]"
                    />
                    <StatPill
                        label="Temporales"
                        value={temporales}
                        className="bg-violet-500/10 ring-1 ring-violet-400/15"
                    />
                    <StatPill
                        label="Definitivos"
                        value={definitivos}
                        className="bg-emerald-500/10 ring-1 ring-emerald-400/15"
                    />
                </div>

                <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-white">Comparativo por tipo</p>
                            <p className="mt-1 text-xs text-white/45">
                                Vista directa del comportamiento de la quincena.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-[220px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                barCategoryGap="32%"
                            >
                                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                    tick={{ fill: "rgba(255,255,255,0.24)", fontSize: 11 }}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                                    contentStyle={{
                                        background: "#101619",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: 14,
                                        color: "#fff",
                                    }}
                                    labelStyle={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}
                                    itemStyle={{ color: "#fff", fontWeight: 600, fontSize: 13 }}
                                    formatter={(value) => [formatNumber(value), "Continuidades"]}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                                    {chartData.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 border-t border-white/8 pt-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-white">Proporción de la quincena</p>
                            <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs text-white/55">
                                Total {formatNumber(total)}
                            </span>
                        </div>

                        <div className="mt-4 space-y-4">
                            <DistributionRow
                                label="Temporales"
                                value={temporales}
                                total={total}
                                color={COLORS.temporales}
                            />
                            <DistributionRow
                                label="Definitivos"
                                value={definitivos}
                                total={total}
                                color={COLORS.definitivos}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChartKpi({ label, value, helper }) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            <p className="mt-2 break-words text-sm text-white/48">{helper}</p>
        </div>
    );
}

function AduanasChart({ quincena, aduanas }) {
    const [activeMetric, setActiveMetric] = useState("total");

    const data = (aduanas ?? [])
        .map((item) => ({
            cd_ua: item.cd_ua ?? item.aduana,
            aduana: item.aduana,
            temporales: item.temporales ?? 0,
            definitivos: item.definitivos ?? 0,
            total: item.total ?? 0,
        }))
        .sort((a, b) => b[activeMetric] - a[activeMetric]);

    const totalMetric = data.reduce((acc, item) => acc + item[activeMetric], 0);
    const topEntry = data[0];
    const topUnits = data.slice(0, 4);
    const chartHeight = Math.max(320, data.length * 32);
    const metric = METRIC_META[activeMetric];

    return (
        <section className="min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(11,18,15,0.88),rgba(24,28,31,0.82))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[#DAA520]/70">
                        Analisis por unidad administrativa
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                        {quincena} - Por Unidad Administrativa
                    </h3>
                    <p className="mt-1 text-sm text-white/52">
                        Comparativo por codigo de UA segun el tipo de continuidad seleccionado.
                    </p>
                </div>

                <div className="inline-flex w-full max-w-full flex-wrap gap-2 rounded-full border border-white/8 bg-black/18 p-1 xl:w-auto">
                    {Object.entries(METRIC_META).map(([key, meta]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setActiveMetric(key)}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${activeMetric === key
                                ? meta.activeClass
                                : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                                }`}
                        >
                            {meta.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <ChartKpi
                    label="Unidades con registro"
                    value={formatNumber(data.length)}
                    helper="Numero de UAs con actividad en la vista seleccionada."
                />
                <ChartKpi
                    label={`Total de Continuidades`}
                    value={formatNumber(totalMetric)}
                    helper="Continuidades en total "
                />
                <ChartKpi
                    label="Mayor concentracion"
                    value={topEntry ? String(topEntry.cd_ua) : "Sin dato"}
                    helper={topEntry ? topEntry.aduana : "Sin registros disponibles."}
                />
            </div>

            <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4">
                    {data.length === 0 ? (
                        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10">
                            <p className="text-sm text-white/35">
                                Sin datos disponibles para esta quincena.
                            </p>
                        </div>
                    ) : (
                        <div className="h-[320px] min-w-0 overflow-x-auto overflow-y-hidden md:h-auto">
                            <div className="min-w-[720px] md:min-w-0">
                                <ResponsiveContainer width="100%" height={chartHeight}>
                                    <BarChart
                                        data={data}
                                        layout="vertical"
                                        margin={{ top: 0, right: 28, left: 0, bottom: 0 }}
                                        barCategoryGap="24%"
                                    >
                                        <CartesianGrid
                                            horizontal={false}
                                            stroke="rgba(255,255,255,0.05)"
                                        />
                                        <XAxis
                                            type="number"
                                            allowDecimals={false}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "rgba(255,255,255,0.28)", fontSize: 11 }}
                                            tickFormatter={formatNumber}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="cd_ua"
                                            width={72}
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: "rgba(255,255,255,0.56)", fontSize: 11 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "rgba(255,255,255,0.04)" }}
                                            contentStyle={{
                                                background: "#101619",
                                                border: "1px solid rgba(255,255,255,0.12)",
                                                borderRadius: 14,
                                                color: "#fff",
                                            }}
                                            labelStyle={{
                                                color: "rgba(255,255,255,0.55)",
                                                fontSize: 12,
                                            }}
                                            itemStyle={{ color: "#fff", fontWeight: 600, fontSize: 13 }}
                                            labelFormatter={(_, payload) =>
                                                payload?.[0]?.payload?.aduana ?? "Unidad administrativa"
                                            }
                                            formatter={(value) => [formatNumber(value), metric.label]}
                                        />
                                        <Bar
                                            dataKey={activeMetric}
                                            fill={metric.color}
                                            radius={[0, 8, 8, 0]}
                                            barSize={18}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                <aside className="grid min-w-0 content-start gap-4">
                    <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                            Mayor concentracion
                        </p>
                        {topEntry ? (
                            <>
                                <p className="mt-3 text-3xl font-semibold text-white">
                                    {topEntry.cd_ua}
                                </p>
                                <p className="mt-2 break-words text-sm text-white/52">
                                    {topEntry.aduana}
                                </p>
                                <p className="mt-4 text-sm text-white/72">
                                    {metric.label}:{" "}
                                    <span className="font-semibold text-white">
                                        {formatNumber(topEntry[activeMetric])}
                                    </span>
                                </p>
                            </>
                        ) : (
                            <p className="mt-2 text-sm text-white/35">Sin registros disponibles.</p>
                        )}
                    </div>

                    <div className="min-w-0 rounded-2xl border border-white/8 bg-black/18 p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/42">
                            Top unidades
                        </p>
                        <div className="mt-4 space-y-4">
                            {topUnits.length > 0 ? (
                                topUnits.map((item) => {
                                    const width =
                                        topEntry?.[activeMetric] > 0
                                            ? (item[activeMetric] / topEntry[activeMetric]) * 100
                                            : 0;

                                    return (
                                        <div
                                            key={`${item.cd_ua}-${activeMetric}`}
                                            className="min-w-0 space-y-1.5"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white">{item.cd_ua}</p>
                                                    <p className="truncate text-xs text-white/45">
                                                        {item.aduana}
                                                    </p>
                                                </div>
                                                <p className="shrink-0 text-sm font-semibold text-white/82">
                                                    {formatNumber(item[activeMetric])}
                                                </p>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/6">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${Math.max(width, item[activeMetric] > 0 ? 10 : 0)}%`,
                                                        backgroundColor: metric.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-white/35">Sin registros disponibles.</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default function EstadisticaMes({ mes }) {
    const [estadisticas, setEstadisticas] = useState(null);
    const [aduanas, setAduanas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            setError(null);

            try {
                const [resMes, resAduanas] = await Promise.all([
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/empleados_completos_sig/mes-continuidades/?mes=${mes + 1}`
                    ),
                    fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/empleados_completos_sig/continuidades-por-ua/?mes=${mes + 1}`
                    ),
                ]);

                if (!resMes.ok || !resAduanas.ok) {
                    throw new Error("No fue posible consultar las estadisticas del mes.");
                }

                const [dataMes, dataAduanas] = await Promise.all([
                    resMes.json(),
                    resAduanas.json(),
                ]);

                setEstadisticas(dataMes);
                setAduanas(dataAduanas);
            } catch (fetchError) {
                console.error("Error fetching estadisticas:", fetchError);
                setError("No fue posible cargar las estadisticas de este mes.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [mes]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                <p className="text-sm text-white/50">
                    Cargando estadisticas de {MONTH_NAMES[mes]}...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-[28px] border border-red-400/15 bg-red-500/5 p-6 text-center">
                <p className="text-sm font-medium text-red-200">{error}</p>
            </div>
        );
    }

    const primeraQuincena = estadisticas?.primera_quincena?.estadisticas ?? {};
    const segundaQuincena = estadisticas?.segunda_quincena?.estadisticas ?? {};
    const primeraAduanas = aduanas?.primera_quincena?.aduanas ?? [];
    const segundaAduanas = aduanas?.segunda_quincena?.aduanas ?? [];
    const fechasAnalizadas = [
        ...(estadisticas?.primera_quincena?.fechas ?? []),
        ...(estadisticas?.segunda_quincena?.fechas ?? []),
    ].filter(Boolean);

    const resumenMensual = {
        total: (primeraQuincena.total ?? 0) + (segundaQuincena.total ?? 0),
        temporales:
            (primeraQuincena.temporales ?? 0) + (segundaQuincena.temporales ?? 0),
        definitivos:
            (primeraQuincena.definitivos ?? 0) + (segundaQuincena.definitivos ?? 0),
    };

    const unidadesConRegistro = new Set(
        [...primeraAduanas, ...segundaAduanas].map(
            (item) => item.cd_ua ?? item.aduana
        )
    ).size;

    return (
        <div className="w-full min-w-0 space-y-5">
            <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,rgba(11,18,15,0.9),rgba(20,24,28,0.84))] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#DAA520]/70">
                            Resumen mensual
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-white">
                            Continuidades registradas en {MONTH_NAMES[mes]}
                        </h2>
                        <p className="mt-2 text-sm text-white/54">
                            Corte mensual con desglose por quincena y por unidad administrativa.
                        </p>
                    </div>

                    <div className="flex max-w-full flex-wrap gap-2">
                        {fechasAnalizadas.length > 0 ? (
                            fechasAnalizadas.map((fecha) => (
                                <span
                                    key={fecha}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                                >
                                    {fecha}
                                </span>
                            ))
                        ) : (
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                                Sin fechas registradas
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        icon={ClipboardList}
                        label="Total del mes"
                        value={formatNumber(resumenMensual.total)}
                    />
                    <SummaryCard
                        icon={BarChart3}
                        label="Temporales"
                        value={formatNumber(resumenMensual.temporales)}
                        accentClass="text-violet-200"
                    />
                    <SummaryCard
                        icon={TrendingUp}
                        label="Definitivos"
                        value={formatNumber(resumenMensual.definitivos)}
                        accentClass="text-emerald-200"
                    />
                    <SummaryCard
                        icon={Building2}
                        label="UAs con registro"
                        value={formatNumber(unidadesConRegistro)}
                    />
                </div>
            </section>

            <div className="grid gap-4 2xl:grid-cols-2">
                <QuincenaCard
                    titulo="1ra Quincena"
                    datos={estadisticas?.primera_quincena?.estadisticas}
                    fechas={estadisticas?.primera_quincena?.fechas}
                />
                <QuincenaCard
                    titulo="2da Quincena"
                    datos={estadisticas?.segunda_quincena?.estadisticas}
                    fechas={estadisticas?.segunda_quincena?.fechas}
                />
            </div>

            <AduanasChart
                quincena="1ra Quincena"
                aduanas={aduanas?.primera_quincena?.aduanas}
            />
            <AduanasChart
                quincena="2da Quincena"
                aduanas={aduanas?.segunda_quincena?.aduanas}
            />
        </div>
    );
}
