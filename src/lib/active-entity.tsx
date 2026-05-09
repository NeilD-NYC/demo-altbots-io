import { createContext, useContext, useState, ReactNode } from "react";
import { DEFAULT_ENTITY_ID, DEMO_ENTITIES } from "./demo-config";

type Ctx = {
  activeEntityId: string;
  setActiveEntityId: (id: string) => void;
  entities: typeof DEMO_ENTITIES;
};

const ActiveEntityContext = createContext<Ctx | null>(null);

export function ActiveEntityProvider({ children }: { children: ReactNode }) {
  const [activeEntityId, setActiveEntityId] = useState<string>(DEFAULT_ENTITY_ID);
  return (
    <ActiveEntityContext.Provider value={{ activeEntityId, setActiveEntityId, entities: DEMO_ENTITIES }}>
      {children}
    </ActiveEntityContext.Provider>
  );
}

export function useActiveEntity() {
  const ctx = useContext(ActiveEntityContext);
  if (!ctx) throw new Error("useActiveEntity must be used within ActiveEntityProvider");
  return ctx;
}
