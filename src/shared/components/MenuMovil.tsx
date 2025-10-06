import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Home, Flame, LogIn } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

const MenuMovil: React.FC = () => {

  const user = useAuthStore((s) => s.user);

  return (
    <div className="dock dock-xl text-center h-[70px] z-30 bg-[#F2F2F2] shadow-inner">
      {/* Inicio */}
      <NavLink to="/domicilios-pitalito" end>
        {({ isActive }) => (
          <button
            className={`flex justify-center flex-col items-center transition-colors ${isActive ? "dock-active" : ""
              }`}
          >
            <Home
              className={`size-[1.2em] ${isActive ? "text-[#FF6600]" : "text-[#333333]"
                }`}
            />
            <span
              className={`dock-label text-sm ${isActive ? "text-[#FF6600] font-semibold" : "text-[#333333]"
                }`}
            >
              Inicio
            </span>
          </button>
        )}
      </NavLink>

      {/* Populares */}
      <NavLink to="/locales-populares">
        {({ isActive }) => (
          <button
            className={`flex justify-center flex-col items-center transition-colors ${isActive ? "dock-active" : ""
              }`}
          >
            <Flame
              className={`size-[1.2em] ${isActive ? "text-[#FF6600]" : "text-[#333333]"
                }`}
            />
            <span
              className={`dock-label text-sm ${isActive ? "text-[#FF6600] font-semibold" : "text-[#333333]"
                }`}
            >
              Populares
            </span>
          </button>
        )}
      </NavLink>

      {!user &&(
        <>
          {/* Login */}
          <Link to="/login">
            <button className="flex justify-center flex-col items-center text-[#333333] hover:text-[#FF6600] transition-colors">
              <LogIn className="size-[1.2em]" />
              <span className="dock-label text-sm">Login</span>
            </button>
          </Link>
        </>
      )}


    </div>
  );
};

export default MenuMovil;
