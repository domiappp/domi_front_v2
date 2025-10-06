import { useEffect, useRef } from "react";
import { useModalStore } from "../../store/modal.store";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

const sizeToBoxClass: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
  full: "w-[92vw] max-w-none",
};

const GlobalModal: React.FC = () => {
  const { isOpen, title, content, size, closeOnBackdrop } = useModalStore();
  const close = useModalStore((s) => s.close);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  // Sincroniza estado con <dialog>
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  // Cerrar por fondo SOLO si closeOnBackdrop === true
  const onBackdropClick: React.MouseEventHandler<HTMLDialogElement> = (e) => {
    if (!closeOnBackdrop) return; // << no se cierra por clic fuera
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const clickInDialog =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!clickInDialog) {
      close();
    }
  };

  return (
    <dialog
      id="global_modal"
      ref={dialogRef}
      className="modal pt-10"
      onClick={onBackdropClick}          // detecta clics en backdrop
      onCancel={(e) => e.preventDefault()} // bloquea cierre con ESC
      // <- quitamos onClose para que NO cierre por motivos ajenos a tus botones
    >
      <div
        className={`modal-box w-11/12 p-0 m-0 ${sizeToBoxClass[size]}`}
        onClick={(e) => e.stopPropagation()} // evita que clics dentro burbujeen al <dialog>
        role="dialog"
        aria-modal="true"
      >
        {title ? (
          <div className="flex px-8 p-4 bg-[#33C6BB] items-start justify-between gap-4">
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <button className="btn btn-circle bg-white text-[#3498DB]" onClick={close} aria-label="Cerrar">
              ✕
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button className="btn btn-circle bg-white text-sky-[#3498DB]" onClick={close} aria-label="Cerrar">
              ✕
            </button>
          </div>
        )}

        {content && <div className="px-8 p-4">{content}</div>}
      </div>
    </dialog>
  );
};

export default GlobalModal;
