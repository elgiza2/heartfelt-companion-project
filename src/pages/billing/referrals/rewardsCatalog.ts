/** @doc Reward catalogue presentation data — images + offline fallback rows. */
import creditsImg from "@/assets/rewards/credits.png";
import starterImg from "@/assets/rewards/starter.png";
import proImg from "@/assets/rewards/pro.png";
import eliteImg from "@/assets/rewards/elite.png";
import imagesImg from "@/assets/rewards/images.png";
import videoImg from "@/assets/rewards/video.png";

export const REWARD_IMAGES: Record<string, string> = {
  credits: creditsImg,
  starter: starterImg,
  pro: proImg,
  elite: eliteImg,
  images: imagesImg,
  video: videoImg,
};

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

/** Mirrors the seeded reward_catalog rows so the page never renders empty. */
export const FALLBACK_REWARDS: CatalogRow[] = [
  { slug: "credits-500", title: "500 credits", description: "A top-up of 500 Megsy credits, added instantly.", category: "credits", image_key: "credits", billing_period: "once", points_cost: 40, stock_total: 500, stock_claimed: 0 },
  { slug: "credits-2000", title: "2,000 credits", description: "A bigger top-up for heavy weeks.", category: "credits", image_key: "credits", billing_period: "once", points_cost: 140, stock_total: 300, stock_claimed: 0 },
  { slug: "images-pack", title: "100 AI images", description: "A pack of 100 premium image generations.", category: "pack", image_key: "images", billing_period: "once", points_cost: 90, stock_total: 300, stock_claimed: 0 },
  { slug: "video-pack", title: "20 AI videos", description: "A pack of 20 AI video generations.", category: "pack", image_key: "video", billing_period: "once", points_cost: 180, stock_total: 150, stock_claimed: 0 },
  { slug: "starter-monthly", title: "Starter — 1 month", description: "Unlimited chat plus the monthly credit allowance.", category: "plan", image_key: "starter", billing_period: "monthly", points_cost: 150, stock_total: 60, stock_claimed: 0 },
  { slug: "pro-monthly", title: "Pro — 1 month", description: "Everything in Starter with a much bigger allowance.", category: "plan", image_key: "pro", billing_period: "monthly", points_cost: 300, stock_total: 50, stock_claimed: 0 },
  { slug: "pro-yearly", title: "Pro — 1 year", description: "A full year of Pro — the best value.", category: "plan", image_key: "pro", billing_period: "yearly", points_cost: 2400, stock_total: 20, stock_claimed: 0 },
  { slug: "elite-yearly", title: "Elite — 1 year", description: "Highest allowance, priority queue and early features.", category: "plan", image_key: "elite", billing_period: "yearly", points_cost: 5000, stock_total: 10, stock_claimed: 0 },
];

export const rewardImage = (row: { image_key?: string | null; slug: string }) =>
  REWARD_IMAGES[row.image_key ?? ""] ??
  REWARD_IMAGES[row.slug.split("-")[0]] ??
  creditsImg;

export const periodLabel = (p: string) =>
  p === "yearly" ? "1 year" : p === "monthly" ? "1 month" : "One-off";
