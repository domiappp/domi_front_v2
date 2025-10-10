// src/pages/home/HomePage.tsx
import React, { useMemo } from 'react';
import CategoriesSlider from '../../shared/components/CategoriesSlider';
import ComerciosPorServicioGrid from '../../shared/components/ComerciosPorServicioGrid';
import InputSearch from '../../shared/components/InputSearch';
import SliderHome from '../../shared/components/SliderHome';
import { useServicesUI } from '../../store/services.store';

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay = 350) {
  const timeout = React.useRef<number | undefined>(undefined);
  return React.useCallback((...args: Parameters<T>) => {
    window.clearTimeout(timeout.current);
    // @ts-ignore
    timeout.current = window.setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

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
      <div className="pt-1.5 lg:p-0 ">
        <SliderHome />
      </div>

      <CategoriesSlider />
{/* 
      <div className="px-3">
        <InputSearch {...inputProps} />
      </div> */}

      <div className="mb-50">
        <ComerciosPorServicioGrid />
      </div>
    </>
  );
};

export default HomePage;
