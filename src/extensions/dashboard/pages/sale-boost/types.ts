import type { Plan, SaleBoostConfig } from "../../../../shared/saleBoostConfig";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface SaleBoostContextValue {
  plan: Plan;
  config: SaleBoostConfig;
  updateConfig: (patch: Partial<SaleBoostConfig>) => void;
  isPremium: boolean;
  isFree: boolean;
  isDirty: boolean;
  saveState: SaveState;
  onSave: () => Promise<void>;
  onResetDefaults: () => void;
  isLoading: boolean;
  error: { message?: string } | null;
}
