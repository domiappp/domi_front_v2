// ==========================
// store/useGlobalModal.ts
// ==========================
import React from "react";
import { create } from "zustand";


export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";


export type OpenModalArgs = {
title?: React.ReactNode;
content?: React.ReactNode;
footer?: React.ReactNode;
size?: ModalSize;
closeOnBackdrop?: boolean; // default: true
onClose?: () => void; // callback al cerrar
};


type ModalState = {
isOpen: boolean;
title?: React.ReactNode;
content?: React.ReactNode;
footer?: React.ReactNode;
size: ModalSize;
closeOnBackdrop: boolean;
onClose?: () => void;
open: (args: OpenModalArgs) => void;
close: () => void;
};


export const useModalStore = create<ModalState>((set, get) => ({
isOpen: false,
title: undefined,
content: undefined,
footer: undefined,
size: "md",
closeOnBackdrop: true,
onClose: undefined,
open: ({ title, content, footer, size = "md", closeOnBackdrop = true, onClose }: OpenModalArgs) =>
set({ isOpen: true, title, content, footer, size, closeOnBackdrop, onClose }),
close: () => {
const cb = get().onClose;
set({ isOpen: false, onClose: undefined });
cb?.();
},
}));


// Hook de conveniencia (re-exportable)
export const useGlobalModal = () => {
const open = useModalStore((s) => s.open);
const close = useModalStore((s) => s.close);
return { open, close };
};