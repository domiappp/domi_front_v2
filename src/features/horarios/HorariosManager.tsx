import { useState } from "react";
import HorariosTable from "./HorariosTable";
import HorarioComercialForm from "./HorarioComercialForm";
import HorarioEspecialForm from "./HorarioEspecialForm";

export default function HorariosManager({ comercioId }: { comercioId: number }) {
  const [activeTab, setActiveTab] = useState<"comercial" | "especial">("comercial");

  return (
    <div className="w-full max-w-9xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Horarios</h1>

      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab("comercial")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "comercial"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary"
          }`}
        >
          Horarios Comerciales
        </button>
        <button
          onClick={() => setActiveTab("especial")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "especial"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-primary"
          }`}
        >
          Horarios Especiales
        </button>
      </div>

      {activeTab === "comercial" ? (
        <>
          <HorarioComercialForm comercioId={comercioId} />
          <HorariosTable comercioId={comercioId} tipo="comercial" />
        </>
      ) : (
        <>
          <HorarioEspecialForm comercioId={comercioId} />
          <HorariosTable comercioId={comercioId} tipo="especial" />
        </>
      )}
    </div>
  );
}
