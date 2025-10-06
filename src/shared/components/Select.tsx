import React, { forwardRef } from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  options: { value: string | number; label: string }[];
  containerClassName?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, helperText, errorText, options, className = "", containerClassName = "", ...rest },
    ref
  ) => {
    const isError = Boolean(errorText);
    return (
      <label className={`form-control w-full ${containerClassName}`}>
        {label && (
          <span className="label">
            <span className="label-text">{label}</span>
          </span>
        )}
        <select
          ref={ref}
          className={["select select-bordered w-full", isError ? "select-error" : "", className].join(" ")}
          {...rest}
        >
          <option value="" disabled hidden>
            Selecciona una opción
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(helperText || errorText) && (
          <span className="label">
            <span className={`label-text-alt ${isError ? "text-error" : "opacity-70"}`}>
              {isError ? errorText : helperText}
            </span>
          </span>
        )}
      </label>
    );
  }
);

Select.displayName = "Select";
