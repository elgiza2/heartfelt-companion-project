/** @doc Reward catalogue presentation data — monthly subscription plans only. */
import starterImg from "@/assets/referral/reward-starter.jpg";
import proImg from "@/assets/referral/reward-pro.jpg";
import eliteImg from "@/assets/referral/reward-elite.jpg";

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

/** Subscriptions only, monthly only — yearly plans are not redeemable. */
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
    slug: "elite-monthly",
    title: "Elite",
    description: "Highest allowance, priority queue and early features.",
    category: "plan",
    plan: "elite",
    billing_period: "monthly",
    points_cost: 2500,
    stock_total: 20,
    stock_claimed: 0,
  },
];

/** A real illustration per redeemable reward — no icons. */
export const PLAN_IMAGE: Record<string, string> = {
  starter: starterImg,
  pro: proImg,
  elite: eliteImg,
};

export const planKey = (row: CatalogRow) =>
  (row.plan ?? row.slug.split("-")[0] ?? "starter").toLowerCase();

export const planImage = (row: CatalogRow) => PLAN_IMAGE[planKey(row)] ?? starterImg;

export const periodLabel = (p: string) => (p === "monthly" ? "1 month" : "One-off");
