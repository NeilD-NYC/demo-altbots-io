import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_ENTITY_ID } from "./demo-config";

export type TaxEntity = {
  id: string;
  entity_name: string;
  entity_type: string;
  aum: number | null;
};

type Ctx = {
  activeEntityId: string;
  setActiveEntityId: (id: string) => void;
  entities: TaxEntity[];
  isSwitching: boolean;
  loading: boolean;
};

const ActiveEntityContext = createContext<Ctx | null>(null);

export function ActiveEntityProvider({ children }: { children: ReactNode }) {
  const [activeEntityId, setActiveId] = useState<string>(DEFAULT_ENTITY_ID);
  const [entities, setEntities] = useState<TaxEntity[]>([]);
  const [isSwitching, setIsSwitching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("tax_entities")
      .select("id, entity_name, entity_type, aum")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setEntities(data as TaxEntity[]);
        setLoading(false);
      });
  }, []);

  const setActiveEntityId = (id: string) => {
    if (id === activeEntityId) return;
    setIsSwitching(true);
    setTimeout(() => {
      setActiveId(id);
      setTimeout(() => setIsSwitching(false), 400);
    }, 200);
  };

  return (
    <ActiveEntityContext.Provider value={{ activeEntityId, setActiveEntityId, entities, isSwitching, loading }}>
      {children}
    </ActiveEntityContext.Provider>
  );
}

export function useActiveEntity() {
  const ctx = useContext(ActiveEntityContext);
  if (!ctx) throw new Error("useActiveEntity must be used within ActiveEntityProvider");
  return ctx;
}
