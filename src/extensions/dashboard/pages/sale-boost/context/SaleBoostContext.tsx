import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";

import { appInstances } from "@wix/app-management";
import { useEmbeds } from "../../../hooks/wix-embeds";
import {
  applyPlanGating,
  DEFAULT_CONFIG,
  DEFAULT_PLAN,
  toEmbedParameters,
  MAP_PLAN_TO_CONFIG,
  type Plan,
  type SaleBoostConfig,
  fromEmbedParameters,
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

  const isPremium = plan === "PREMIUM";
  const isFree = plan === DEFAULT_PLAN;

  const getPlan = async () => {
    const instanceResponse: unknown = await appInstances.getAppInstance();
    const instance = (
      instanceResponse as {
        instance?: {
          isFree?: boolean;
          billing?: { packageName?: string };
        };
      }
    )?.instance;

    return (
      (MAP_PLAN_TO_CONFIG as Record<string, Plan>)[
        instance?.billing?.packageName as keyof typeof MAP_PLAN_TO_CONFIG
      ] || DEFAULT_PLAN
    );
  };

  const updateDataPlanEmbed = async (plan: Plan, config: SaleBoostConfig) => {
    try {
      const payload = toEmbedParameters(plan, config);
      await embeds.saveParams(payload);
    } catch (error) {
      console.error("Error updating data plan embed", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Get plan from app instance
        const resolvedPlan = await getPlan();

        // Get data embed parameters
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

        if (resolvedPlan !== parsed.plan) {
          updateDataPlanEmbed(resolvedPlan, sanitizedConfig);
        }

        setPlan(resolvedPlan);
        setConfig(sanitizedConfig);
        setIsDirty(false);
        setSaveState("idle");
      } catch (error) {
        console.error("Error initializing sale boost", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const resolvedPlan = await getPlan();
      setPlan(resolvedPlan);
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

    setConfig((prev) => ({ ...prev, ...sanitizedPatch }));
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

  const value: SaleBoostContextValue = {
    plan,
    config,
    updateConfig,
    isPremium,
    isFree,
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
