export type Plan = "FREE" | "MEDIUM";
export type Action = "NEW_TAB" | "SAME_TAB";
export type Visibility = "ALL" | "DESKTOP" | "MOBILE";

export type BooleanString = "0" | "1";

export type SaleBoostConfig = {
  header: string;
  body: string;
  buttonLabel: string;
  link: string;
  action: Action;
  textColor: string;
  buttonColor: string;
  imageUrl: string;
  imageLink: string;
  showCloseButton: BooleanString;
  hideOnBackdropClick: BooleanString;
  visibility: Visibility;
  popupDelay: number; // seconds
};

export const DEFAULT_PLAN: Plan = "MEDIUM";

export const DEFAULT_CONFIG: SaleBoostConfig = {
  header: "🔥 15% OFF SALE",
  body: "Up to 15% off for limited time and on selected items. plus free shipping for the first 100 buyers",
  buttonLabel: "Get the discount now!",
  link: "https://example.com",
  action: "NEW_TAB",
  textColor: "#000000",
  buttonColor: "#c62828",
  imageUrl:
    "https://smartarget-sp.ams3.cdn.digitaloceanspaces.com/assets%2Fpopup.png",
  imageLink: "https://example.com",
  showCloseButton: "1",
  hideOnBackdropClick: "1",
  visibility: "ALL",
  popupDelay: 2,
};

export function applyPlanGating(
  config: SaleBoostConfig,
  plan: Plan
): SaleBoostConfig {
  if (plan === "MEDIUM") return config;
  return {
    ...config,
    popupDelay: 0,
    imageUrl: "",
    imageLink: "",
    visibility: "ALL",
  };
}

function safeJsonParse(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function coerceString(value: unknown, fallback: string): string {
  const v = safeJsonParse(value);
  return typeof v === "string" ? v : fallback;
}

function coerceNumber(value: unknown, fallback: number): number {
  const v = safeJsonParse(value);
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function coerceEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  const v = safeJsonParse(value);
  return typeof v === "string" && (allowed as readonly string[]).includes(v)
    ? (v as T)
    : fallback;
}

export function fromEmbedParameters(params: Record<string, unknown>): {
  plan: Plan;
  config: SaleBoostConfig;
} {
  const plan = coerceEnum<Plan>(
    params.plan,
    ["FREE", "MEDIUM"] as const,
    DEFAULT_PLAN
  );

  const config: SaleBoostConfig = {
    header: coerceString(params.header, DEFAULT_CONFIG.header),
    body: coerceString(params.body, DEFAULT_CONFIG.body),
    buttonLabel: coerceString(params.buttonLabel, DEFAULT_CONFIG.buttonLabel),
    link: coerceString(params.link, DEFAULT_CONFIG.link),
    action: coerceEnum<Action>(
      params.action,
      ["NEW_TAB", "SAME_TAB"] as const,
      DEFAULT_CONFIG.action
    ),
    textColor: coerceString(params.textColor, DEFAULT_CONFIG.textColor),
    buttonColor: coerceString(params.buttonColor, DEFAULT_CONFIG.buttonColor),
    imageUrl: coerceString(params.imageUrl, DEFAULT_CONFIG.imageUrl),
    imageLink: coerceString(params.imageLink, DEFAULT_CONFIG.imageLink),
    showCloseButton: coerceEnum<BooleanString>(
      params.showCloseButton,
      ["0", "1"] as const,
      DEFAULT_CONFIG.showCloseButton
    ),
    hideOnBackdropClick: coerceEnum<BooleanString>(
      params.hideOnBackdropClick,
      ["0", "1"] as const,
      DEFAULT_CONFIG.hideOnBackdropClick
    ),
    visibility: coerceEnum<Visibility>(
      params.visibility,
      ["ALL", "DESKTOP", "MOBILE"] as const,
      DEFAULT_CONFIG.visibility
    ),
    popupDelay: coerceNumber(params.popupDelay, DEFAULT_CONFIG.popupDelay),
  };

  return { plan, config };
}

/**
 * Embedded Script parameters are substituted into the HTML template as `{{paramName}}`.
 * To keep the HTML JSON-safe, we store every value as a JSON literal string.
 * Example: header => "\"Hello\"" and popupDelay => "2"
 */
export function toEmbedParameters(
  plan: Plan,
  config: SaleBoostConfig
): Record<string, string> {
  return {
    plan: plan,
    header: config.header,
    body: config.body,
    buttonLabel: config.buttonLabel,
    link: config.link,
    action: config.action,
    textColor: config.textColor,
    buttonColor: config.buttonColor,
    imageUrl: config.imageUrl,
    imageLink: config.imageLink,
    showCloseButton: config.showCloseButton,
    hideOnBackdropClick: config.hideOnBackdropClick,
    visibility: config.visibility,
    popupDelay: config.popupDelay.toString(),
  };
}
