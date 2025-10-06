import { useMemo, useState, type JSX } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";

/** ===== Tipos ===== */
type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Lunes … 6=Domingo (UI)
type Interval = { start: string; end: string }; // HH:mm
type DayState = { enabled: boolean; intervals: Interval[] };
type HoursState = Record<DayIndex, DayState>;

/** ===== Datos base / util ===== */
const OSM_DAYS: Record<DayIndex, string> = {
  0: "Mo",
  1: "Tu",
  2: "We",
  3: "Th",
  4: "Fr",
  5: "Sa",
  6: "Su",
};

const UI_DAYS: { key: DayIndex; label: string }[] = [
  { key: 0, label: "Lunes" },
  { key: 1, label: "Martes" },
  { key: 2, label: "Miércoles" },
  { key: 3, label: "Jueves" },
  { key: 4, label: "Viernes" },
  { key: 5, label: "Sábado" },
  { key: 6, label: "Domingo" },
];

function defaultState(): HoursState {
  const hours = {} as HoursState;
  UI_DAYS.forEach(({ key }) => {
    hours[key] = { enabled: false, intervals: [{ start: "09:00", end: "18:00" }] };
  });
  return hours;
}

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
function toNumHHmm(v: string): number | null {
  if (!HHMM.test(v)) return null;
  const [h, m] = v.split(":").map((x) => parseInt(x, 10));
  return h * 100 + m; // 14:30 → 1430
}

/** Valida solapes/formatos inválidos */
function hasOverlap(intervals: Interval[]): boolean {
  const sorted = [...intervals]
    .map((i) => ({ s: toNumHHmm(i.start), e: toNumHHmm(i.end) }))
    .sort((a, b) => (a.s ?? 0) - (b.s ?? 0));

  for (let i = 0; i < sorted.length; i++) {
    const it = sorted[i];
    if (it.s === null || it.e === null) return true; // formato inválido
    if (it.s >= it.e) return true; // rango invertido o vacío
    if (i > 0) {
      const prev = sorted[i - 1];
      if (prev.e === null) return true;
      // permite tocar (12:00-13:00 seguido de 13:00-15:00). Cambia a <= para prohibir tocar.
      if (it.s < prev.e) return true;
    }
  }
  return false;
}

/** Agrupa días consecutivos con misma “firma” para export opening_hours */
function groupByIntervals(hours: HoursState) {
  const serialize = (arr: Interval[]) => arr.map((i) => `${i.start}-${i.end}`).join(",");
  const sig = (d: DayIndex) => serialize(hours[d].intervals);
  const enabledDays = UI_DAYS.filter(({ key }) => hours[key].enabled);
  const groups: { from: DayIndex; to: DayIndex; signature: string }[] = [];
  let i = 0;
  while (i < enabledDays.length) {
    const startIdx = enabledDays[i].key;
    const signature = sig(startIdx);
    let j = i;
    while (
      j + 1 < enabledDays.length &&
      enabledDays[j + 1].key === enabledDays[j].key + 1 &&
      sig(enabledDays[j + 1].key) === signature
    ) {
      j++;
    }
    groups.push({ from: startIdx, to: enabledDays[j].key, signature });
    i = j + 1;
  }
  return groups;
}

/** Export básico: solo intervalos diurnos (no medianoche) */
function toOpeningHoursBasic(hours: HoursState): string {
  const groups = groupByIntervals(hours);
  if (!groups.length) return "off";
  return groups
    .map(({ from, to, signature }) => {
      const dayPart = from === to ? OSM_DAYS[from] : `${OSM_DAYS[from]}-${OSM_DAYS[to]}`;
      const ranges = signature.split(",").filter(Boolean).join(", ");
      return `${dayPart} ${ranges}`;
    })
    .join("; ");
}

/** ===== Componente ===== */
export default function BusinessHoursEditor(): JSX.Element {
  const [hours, setHours] = useState<HoursState>(defaultState());
  const [tz, setTz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

  const errors = useMemo(() => {
    const errs: Partial<Record<DayIndex, string>> = {};
    for (const { key } of UI_DAYS) {
      const h = hours[key];
      if (h.enabled && hasOverlap(h.intervals)) {
        errs[key] = "Intervalos inválidos o solapados";
      }
    }
    return errs;
  }, [hours]);

  const jsonExport = useMemo(() => ({ timezone: tz, days: hours }), [hours, tz]);
  const ohExport = useMemo(() => toOpeningHoursBasic(hours), [hours]);

  const setDay = (dayKey: DayIndex, updater: (prev: DayState) => DayState) =>
    setHours((prev) => ({ ...prev, [dayKey]: updater(prev[dayKey]) }));

  const copyMonToFri = () => {
    const monday = hours[0];
    setHours((prev) => ({
      ...prev,
      1: JSON.parse(JSON.stringify(monday)),
      2: JSON.parse(JSON.stringify(monday)),
      3: JSON.parse(JSON.stringify(monday)),
      4: JSON.parse(JSON.stringify(monday)),
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Horarios del Establecimiento</h1>
            <p className="text-sm text-gray-600">
              Define intervalos por día, evita solapamientos y exporta a JSON u "opening_hours".
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Zona horaria</label>
            <input
              className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm"
              value={tz}
              onChange={(e) => setTz(e.target.value)}
              placeholder="e.g. America/Bogota"
            />
            <button
              onClick={copyMonToFri}
              className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-100"
            >
              Copiar Lunes → Viernes
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {UI_DAYS.map(({ key, label }) => {
            const day = hours[key];
            const err = errors[key];
            return (
              <div key={key} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) => setDay(key, (prev) => ({ ...prev, enabled: e.target.checked }))}
                    />
                    <span className="font-medium">{label}</span>
                  </label>
                  {err && (
                    <span className="flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle size={14} /> {err}
                    </span>
                  )}
                </div>

                {day.enabled && (
                  <div className="mt-3 space-y-2">
                    {day.intervals.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="time"
                          className="w-28 rounded-xl border px-2 py-2 text-sm"
                          value={it.start}
                          onChange={(e) =>
                            setDay(key, (prev) => ({
                              ...prev,
                              intervals: prev.intervals.map((x, i) => (i === idx ? { ...x, start: e.target.value } : x)),
                            }))
                          }
                        />
                        <span className="text-sm text-gray-500">a</span>
                        <input
                          type="time"
                          className="w-28 rounded-xl border px-2 py-2 text-sm"
                          value={it.end}
                          onChange={(e) =>
                            setDay(key, (prev) => ({
                              ...prev,
                              intervals: prev.intervals.map((x, i) => (i === idx ? { ...x, end: e.target.value } : x)),
                            }))
                          }
                        />
                        <button
                          onClick={() =>
                            setDay(key, (prev) => ({
                              ...prev,
                              intervals: prev.intervals.filter((_, i) => i !== idx),
                            }))
                          }
                          className="ml-auto rounded-xl border border-gray-200 bg-white p-2 hover:bg-gray-50"
                          aria-label="Eliminar intervalo"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() =>
                        setDay(key, (prev) => ({
                          ...prev,
                          intervals: [...prev.intervals, { start: "14:00", end: "18:00" }],
                        }))
                      }
                      className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                    >
                      <Plus size={16} /> Añadir intervalo
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Exportar</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">JSON</label>
              <textarea
                readOnly
                className="h-40 w-full rounded-xl border bg-gray-50 p-2 text-xs"
                value={JSON.stringify(jsonExport, null, 2)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">opening_hours (básico)</label>
              <input readOnly className="w-full rounded-xl border bg-gray-50 p-2 text-sm" value={ohExport} />
              <p className="mt-2 text-xs text-gray-500">
                Para reglas avanzadas (festivos, 24h, excepciones) usa la librería
                <code className="mx-1 rounded bg-gray-100 px-1">opening_hours</code> del ecosistema OpenStreetMap.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-xs text-gray-500">
          Consejo: evita intervalos que crucen medianoche (ej. 22:00-02:00). Si necesitas eso o excepciones por fecha,
          combina este editor con <strong>opening_hours</strong> o guarda reglas especiales aparte.
        </footer>
      </div>
    </div>
  );
}
