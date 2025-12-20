import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

import { useEmbeds } from "../../../hooks/wix-embeds";
import {
  applyPlanGating,
  DEFAULT_CONFIG,
  DEFAULT_PLAN,
  fromEmbedParameters,
  toEmbedParameters,
  type Plan,
  type SaleBoostConfig,
} from "../../../../../shared/saleBoostConfig";
import type { SaleBoostContextValue, SaveState } from "../types";

const SaleBoostContext = createContext<SaleBoostContextValue | null>(null);

export const useSaleBoost = (): SaleBoostContextValue => {
  const ctx = useContext(SaleBoostContext);
  if (!ctx) {
    throw new Error("useSaleBoost must be used within SaleBoostProvider");
  }
  return ctx;
};

export const useSaleBoostPreview = () => {
  const { config, plan } = useSaleBoost();
  return useMemo(() => applyPlanGating(config, plan), [config, plan]);
};

interface Props {
  children: ReactNode;
}

export const SaleBoostProvider: FC<Props> = ({ children }) => {
  const embeds = useEmbeds();

  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [config, setConfig] = useState<SaleBoostConfig>(DEFAULT_CONFIG);
  const [isDirty, setIsDirty] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  // const isPremium = plan === "MEDIUM";
  const isPremium = true;
  const premiumFieldsDisabled = !isPremium;

  useEffect(() => {
    (async () => {
      try {
        const params = await embeds.loadParams();
        const parsed = fromEmbedParameters(params);

        // Normalize initial config: strip backslashes from any string values
        const sanitizedConfig = Object.fromEntries(
          Object.entries(parsed.config).map(([key, value]) => {
            if (typeof value === "string") {
              return [key, value.replaceAll(/\\/g, "").replaceAll('"', "")];
            }
            return [key, value];
          })
        ) as SaleBoostConfig;

        // setPlan(parsed.plan);
        setPlan("MEDIUM");
        setConfig(sanitizedConfig);
        setIsDirty(false);
        setSaveState("idle");
      } catch {}
    })();
  }, []);

  const updateConfig = (patch: Partial<SaleBoostConfig>) => {
    // Normalize string values to strip backslashes (e.g. from escaped JSON)
    const sanitizedPatch = Object.fromEntries(
      Object.entries(patch).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, value.replaceAll("\\", "")];
        }
        return [key, value];
      })
    ) as Partial<SaleBoostConfig>;

    setConfig((prev) => {
      const newConfig = { ...prev, ...sanitizedPatch };
      return newConfig;
    });
    setIsDirty(true);
    setSaveState("idle");
  };

  const onSave = async () => {
    setSaveState("saving");
    try {
      const payload = toEmbedParameters(plan, config);
      await embeds.saveParams(payload);
      setIsDirty(false);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  const onResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setIsDirty(true);
    setSaveState("idle");
  };

  const handleSetPlan = (p: Plan) => {
    setIsDirty(true);
    setSaveState("idle");
  };

  const value: SaleBoostContextValue = {
    plan,
    setPlan: handleSetPlan,
    config,
    updateConfig,
    isPremium,
    premiumFieldsDisabled,
    isDirty,
    saveState,
    onSave,
    onResetDefaults,
    isLoading: embeds.isLoading,
    error: embeds.error,
  };

  return (
    <SaleBoostContext.Provider value={value}>
      {children}
    </SaleBoostContext.Provider>
  );
};
