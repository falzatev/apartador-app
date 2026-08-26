import React, { createContext, useContext, useState, ReactNode } from "react";

type EnviosContextType = {
  enviosCreados: number;
  incrementarEnvios: () => void;
};

const EnviosContext = createContext<EnviosContextType | undefined>(undefined);

export function EnviosProvider({ children }: { children: ReactNode }) {
  const [enviosCreados, setEnviosCreados] = useState(0);

  const incrementarEnvios = () => {
    setEnviosCreados((prev) => prev + 1);
  };

  return (
    <EnviosContext.Provider value={{ enviosCreados, incrementarEnvios }}>
      {children}
    </EnviosContext.Provider>
  );
}

export function useEnvios() {
  const context = useContext(EnviosContext);
  if (context === undefined) {
    throw new Error("useEnvios debe usarse dentro de EnviosProvider");
  }
  return context;
}
