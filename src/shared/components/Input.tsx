import React, { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      type,
      ...rest
    },
    ref
  ) => {
    const isError = Boolean(errorText);

    // 👇 Si es hidden, devolvemos solo el input
    if (type === "hidden") {
      return <input type="hidden" ref={ref} {...rest} />;
    }

    return (
      <label className={`form-control w-full flex flex-col ${containerClassName}`}>
        {label && (
          <span className="label">
            <span className="label-text text-gray-800 text-sm lowercase first-letter:uppercase">
              {label}
            </span>
          </span>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-3 grid place-items-center pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={[
              "input border w-full rounded-md border-gray-300",
              isError ? "input-error" : "",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              className,
            ].join(" ")}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-3 grid place-items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {(helperText || errorText) && (
          <span className="label">
            <span
              className={`label-text-alt text-xs mt-0.5 ml-0.5 ${
                isError ? "text-error" : "opacity-70"
              }`}
            >
              {isError ? errorText : helperText}
            </span>
          </span>
        )}
      </label>
    );
  }
);

Input.displayName = "Input";
