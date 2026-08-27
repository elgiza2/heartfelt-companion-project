/** @doc Reward catalogue presentation data — subscription plans only. */

export interface CatalogRow {
  slug: string;
  title: string;
  description: string | null;
  category?: string;
  image_key?: string | null;
  plan?: string | null;
  billing_period: string;
  points_cost: number;
  stock_total: number;
  stock_claimed: number;
}

/** Subscriptions only — the redemption catalogue is plans, nothing else. */
export const FALLBACK_REWARDS: CatalogRow[] = [
  {
    slug: "starter-monthly",
    title: "Starter",
    description: "Unlimited chat plus the monthly credit allowance.",
    category: "plan",
    plan: "starter",
    billing_period: "monthly",
    points_cost: 800,
    stock_total: 60,
    stock_claimed: 0,
  },
  {
    slug: "pro-monthly",
    title: "Pro",
    description: "Everything in Starter with a much bigger allowance.",
    category: "plan",
    plan: "pro",
    billing_period: "monthly",
    points_cost: 1500,
    stock_total: 50,
    stock_claimed: 0,
  },
  {
    slug: "pro-yearly",
    title: "Pro",
    description: "A full year of Pro — the best value.",
    category: "plan",
    plan: "pro",
    billing_period: "yearly",
    points_cost: 12000,
    stock_total: 20,
    stock_claimed: 0,
  },
  {
    slug: "elite-yearly",
    title: "Elite",
    description: "Highest allowance, priority queue and early features.",
    category: "plan",
    plan: "elite",
    billing_period: "yearly",
    points_cost: 20000,
    stock_total: 10,
    stock_claimed: 0,
  },
];

/** Clean gradient artwork per plan — rendered as a card, no bitmap assets. */
export const PLAN_ART: Record<string, { gradient: string; pills: string[] }> = {
  starter: {
    gradient:
      "linear-gradient(140deg, hsl(var(--foreground) / 0.10), hsl(var(--foreground) / 0.02))",
    pills: ["Unlimited chat", "Monthly credits"],
  },
  pro: {
    gradient:
      "linear-gradient(140deg, hsl(var(--primary) / 0.30), hsl(var(--primary) / 0.06))",
    pills: ["All models", "Bigger allowance", "Priority"],
  },
  elite: {
    gradient: "linear-gradient(140deg, rgba(201,162,76,0.38), rgba(201,162,76,0.06))",
    pills: ["Max allowance", "Priority queue", "Early features"],
  },
};

export const planKey = (row: CatalogRow) =>
  (row.plan ?? row.slug.split("-")[0] ?? "starter").toLowerCase();

export const planArt = (row: CatalogRow) => PLAN_ART[planKey(row)] ?? PLAN_ART.starter;

export const periodLabel = (p: string) =>
  p === "yearly" ? "1 year" : p === "monthly" ? "1 month" : "One-off";
