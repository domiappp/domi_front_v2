// src/pages/home/HomePage.tsx
import React, { useMemo } from 'react';
import CategoriesSlider from '../../shared/components/CategoriesSlider';
import ComerciosPorServicioGrid from '../../shared/components/ComerciosPorServicioGrid';
import InputSearch from '../../shared/components/InputSearch';
import SliderHome from '../../shared/components/SliderHome';
import { useServicesUI } from '../../store/services.store';

const BRAND_ORANGE = '#FF6B00';

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 350) {
  const timeout = React.useRef<number | undefined>(undefined);
  return React.useCallback((...args: Parameters<T>) => {
    window.clearTimeout(timeout.current);
    // @ts-ignore
    timeout.current = window.setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

// Marquee horizontal de servicios destacados
const ServicesHighlightMarquee: React.FC = () => {
  const messages = [
    'Envíos rápidos a domicilio',
    'Recogemos y entregamos por ti',
    'Compras y diligencias a domicilio',
    'Atención 24 horas todos los días',
    'Rapidez, eficiencia y confianza',
    'Tu domicilio en minutos, sin filas',
    'Escríbenos al WhatsApp 321 312 3213',
  ];

  return (
    <div
      className="w-full py-2 h-auto lg:h-16 flex items-center border-y services-marquee overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${BRAND_ORANGE} 0%, #FF8A33 45%, #FFB066 100%)`,
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      {/* estilos del marquee */}
      <style>{`
        .services-marquee-track {
          display: inline-flex;
          align-items: center;
          gap: 1.5rem;
          animation: services-marquee 26s linear infinite;
        }

        .services-marquee:hover .services-marquee-track {
          animation-play-state: paused;
        }

        @keyframes services-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="w-full">
        <div className="flex items-center">
          <div className="services-marquee-track">
            {/* Duplicamos la lista para un loop continuo */}
            {[...messages, ...messages].map((msg, idx) => (
              <span
                key={`${msg}-${idx}`}
                className="inline-flex items-center whitespace-nowrap rounded-full bg-black/10 px-3 py-1 text-[10px] sm:text-xs md:text-sm font-semibold text-white shadow-sm"
              >
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white/90" />
                {msg}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const search = useServicesUI((s) => s.search);
  const setSearch = useServicesUI((s) => s.setSearch);
  const debouncedSetSearch = useDebouncedCallback(setSearch, 350);

  const inputProps = useMemo(
    () => ({
      defaultValue: search,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetSearch(e.target.value);
      },
      placeholder: 'Buscar comercios por nombre, NIT, dirección…',
    }),
    [search, debouncedSetSearch]
  );

  return (
    <>
      <div>
        <SliderHome />
      </div>

      <div className="w-full bg-slate-50 py-4">
        <div className="w-full lg:container mx-auto">
          <CategoriesSlider />
        </div>
      </div>

      {/* Marquee de servicios destacados (reemplaza el div naranja fijo) */}
      <ServicesHighlightMarquee />

      {/* 
      <div className="px-3">
        <InputSearch {...inputProps} />
      </div> 
      */}

      <div className="mb-50 bg-gray-50 w-full">
        <div className="w-full xl:w-[85%] mx-auto">
          <ComerciosPorServicioGrid />
        </div>
      </div>
    </>
  );
};

export default HomePage;
