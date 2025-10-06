import React from "react";

type ButtonLinkProps = {
  href: string;
  newTab?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export default function ButtonLink({
  href,
  newTab = false,
  className = "",
  children = "CLICK AQUÍ",
}: ButtonLinkProps) {
  const target = newTab ? "_blank" : undefined;
  const rel = newTab ? "noopener noreferrer" : undefined;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={[
        // Layout & shape
        "inline-flex items-center justify-center rounded-full",
        // Padding responsivo (más pequeño en móviles)
        "px-3 py-1.5 text-xs", // móviles
        "sm:px-4 sm:py-2 sm:text-sm", // tablets
        "md:px-6 md:py-2.5 md:text-base", // laptops
        "lg:px-8 lg:py-3 lg:text-lg", // desktops
        // Typography
        "font-semibold tracking-wide italic",
        // Effects
        "shadow-md transition-transform duration-150",
        "hover:-translate-y-0.5 active:translate-y-0",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300",
        className,
      ].join(" ")}
      style={{
        backgroundColor: "#D64545", // 🔴 rojo más intenso
        color: "#FFF2D6", // crema
      }}
    >
      {children}
    </a>
  );
}
