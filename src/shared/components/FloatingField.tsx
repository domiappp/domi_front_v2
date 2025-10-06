import React from 'react'
import type { FieldError } from 'react-hook-form'

type FloatingFieldProps = {
  id: string
  label: string
  children: React.ReactNode
  error?: FieldError
  className?: string
}

const FloatingField: React.FC<FloatingFieldProps> = ({ id, label, children, error, className }) => {
  return (
    <div className={`form-control outline-none ${className ?? ''}`}>
      <div className="relative">
        {/* Label flotante dentro del input */}
        <label
          htmlFor={id}
          className="absolute left-4 top-2 text-xs text-base-content/60 pointer-events-none"
        >
          {label}
        </label>

        {/* Contenedor visual del “input” */}
        <div className={`rounded-xl py-2 bg-base-300 outline-none transition-colors`}>
          {/* El input real va aquí dentro */}
          {children}
        </div>
      </div>

      {/* Error */}
      {error && <span className="text-error text-sm mt-1">{error.message as string}</span>}
    </div>
  )
}

export default FloatingField
