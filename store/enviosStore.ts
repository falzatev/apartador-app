import { create } from "zustand";

type EnviosStore = {
  enviosCreados: number;
  incrementarEnvios: () => void;
};

export const useEnviosStore = create<EnviosStore>((set) => ({
  enviosCreados: 0,
  incrementarEnvios: () =>
    set((state) => ({ enviosCreados: state.enviosCreados + 1 })),
}));
