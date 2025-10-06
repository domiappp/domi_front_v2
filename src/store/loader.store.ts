// stores/useLoader.ts
import { create } from 'zustand';

type LoaderState = {
  visible: boolean;
  pending: number;
  shownAt: number | null;
  hideTimer: number | null;
  minVisibleMs: number;
  show: () => void;
  hide: () => void;
};

export const useLoader = create<LoaderState>((set, get) => ({
  visible: false,
  pending: 0,
  shownAt: null,
  hideTimer: null,
  minVisibleMs: 500,

  show: () => {
    const { pending, hideTimer } = get();
    if (hideTimer) {
      clearTimeout(hideTimer);
      set({ hideTimer: null });
    }
    if (pending === 0) {
      set({ visible: true, shownAt: Date.now(), pending: 1 });
    } else {
      set({ pending: pending + 1 });
    }
  },

  hide: () => {
    const { pending, shownAt, minVisibleMs } = get();
    if (pending <= 0) return;
    const newPending = pending - 1;
    if (newPending > 0) {
      set({ pending: newPending });
      return;
    }
    const elapsed = shownAt ? Date.now() - shownAt : minVisibleMs;
    const remaining = Math.max(0, minVisibleMs - elapsed);

    if (remaining === 0) {
      set({ visible: false, pending: 0, shownAt: null, hideTimer: null });
    } else {
      const timer = setTimeout(() => {
        const { pending: pNow } = get();
        if (pNow === 0) set({ visible: false, shownAt: null, hideTimer: null });
        else set({ hideTimer: null });
      }, remaining);
      set({ pending: 0, hideTimer: timer });
    }
  },
}));
