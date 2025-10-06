// src/components/NavbarAdmin.tsx
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '../../services/useAuth'           // 👈 usa tu hook
import { useAuthStore } from '../../store/auth.store'      // clear + setReason (si lo tienes)

const NavbarAdmin: React.FC = () => {
  const navigate = useNavigate()
  const modalRef = useRef<HTMLDialogElement>(null)

  const logout = useLogout()
  const user = useAuthStore(s => s.user)
  const clear = useAuthStore(s => s.clear)
  // si agregaste el motivo en el store:
  const setReason = (useAuthStore as any).getState?.().setReason || (() => {})

  const openLogoutModal = () => modalRef.current?.showModal()

  const doLogout = async () => {
    try {
      await logout.mutateAsync()       // POST /auth/logout (tu hook)
    } catch {
      // ignoramos errores (p.ej. ya estaba cerrada la sesión)
    } finally {
      clear()
      setReason('logout')              // opcional: para mostrar mensaje en /login
      navigate('/login', { replace: true })
    }
  }

  const busy: boolean =
    (logout as any).isPending ?? (logout as any).isLoading ?? false

  const displayName = user?.rol ?? (user as any)?.email ?? 'Admin'
  const initial = displayName?.charAt(0)?.toUpperCase?.() ?? 'A'

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        {/* Brand */}
        <div className="navbar-start">
          <Link to="/dashboard" className="btn btn-ghost text-xl font-bold">
            Panel Admin
          </Link>
        </div>

        {/* Center (opcional) */}
        <div className="navbar-center hidden md:flex" />

        {/* Right */}
        <div className="navbar-end gap-2">
          <span className="hidden sm:inline text-sm text-base-content/70">
            {displayName} {user?.rol ? `· ${user.rol}` : ''}
          </span>

          {/* Dropdown usuario */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-sm">{initial}</span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title"><span>Mi cuenta</span></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><button className="text-error" onClick={openLogoutModal}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de confirmación (daisyUI) */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cerrar sesión</h3>
          <p className="py-2">¿Seguro que quieres salir?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancelar</button>
            </form>
            <button
              onClick={doLogout}
              disabled={busy}
              className={`btn btn-error ${busy ? 'btn-disabled loading' : ''}`}
            >
              {busy ? 'Saliendo…' : 'Sí, cerrar sesión'}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default NavbarAdmin
