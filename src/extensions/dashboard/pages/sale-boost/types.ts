import type { Plan, SaleBoostConfig } from "../../../../shared/saleBoostConfig";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface SaleBoostContextValue {
  plan: Plan;
  setPlan: (p: Plan) => void;
  config: SaleBoostConfig;
  updateConfig: (patch: Partial<SaleBoostConfig>) => void;
  isPremium: boolean;
  premiumFieldsDisabled: boolean;
  isDirty: boolean;
  saveState: SaveState;
  onSave: () => Promise<void>;
  onResetDefaults: () => void;
  isLoading: boolean;
  error: { message?: string } | null;
}

