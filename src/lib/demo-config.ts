// Demo config — Wynfield Trust LP is the default public-facing entity.
export const DEMO_ENTITIES = [
  { id: "11111111-1111-1111-1111-111111111111", name: "Wynfield Trust LP" },
  { id: "22222222-2222-2222-2222-222222222222", name: "Wynfield Charitable Foundation" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Wynfield Family Endowment" },
] as const;

export const DEFAULT_ENTITY_ID = DEMO_ENTITIES[0].id;
