import { create } from "zustand";
import { StoreState } from "./interface";

export const useStore = create<StoreState>((set) => ({
  showAuthModal: false,
  currentlyHoveredMedia: "",
  setShowAuthModal: (showAuthModal) =>
    set(() => ({ showAuthModal: showAuthModal })),
  setCurrentlyHoveredMedia: (currentlyHoveredMedia) =>
    set(() => ({ currentlyHoveredMedia: currentlyHoveredMedia })),
}));
