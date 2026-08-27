/** @doc Redemption page — a clean, uncluttered list of subscription rewards. */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { goBackOr } from "@/lib/navigation";
import { useReferrals } from "../ReferralsPage";
import {
  FALLBACK_REWARDS,
  type CatalogRow,
  periodLabel,
  planImage,
  planKey,
} from "./rewardsCatalog";

export default function RewardsTab() {
  const navigate = useNavigate();
  const { points, rewards, redeemReward } = useReferrals();
  const [busy, setBusy] = useState<string | null>(null);

  const list = rewards.length > 0 ? (rewards as unknown as CatalogRow[]) : FALLBACK_REWARDS;
  const shown = useMemo(
    () =>
      [...list]
        .filter((r) => (r.category ?? "plan") === "plan" && r.billing_period !== "yearly")
        .sort((a, b) => a.points_cost - b.points_cost),
    [list],
  );

  const redeem = async (slug: string) => {
    setBusy(slug);
    try {
      await redeemReward(slug);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/settings/referrals")}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent active:scale-95"
        >
          <ArrowLeft className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </button>
        <div className="ml-auto rounded-full border border-foreground/10 bg-foreground/[0.04] px-3 py-1.5 text-[13px] font-semibold text-foreground">
          {points.toLocaleString()} pts
        </div>
      </div>

      <header>
        <h1 className="text-[24px] font-semibold tracking-tight text-foreground">Redeem</h1>
        <p className="mt-1 text-[13px] text-foreground/60">
          Spend your points on a free monthly subscription.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {shown.map((r) => {
          const left = Math.max(0, r.stock_total - r.stock_claimed);
          const affordable = points >= r.points_cost && left > 0;
          return (
            <li
              key={r.slug}
              className="overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-foreground/[0.02]"
            >
              <img
                src={planImage(r)}
                alt={`${planKey(r)} subscription reward`}
                width={1024}
                height={640}
                loading="lazy"
                className="h-[132px] w-full object-cover"
              />
              <div className="p-4">
                <p className="text-[16px] font-semibold capitalize text-foreground">
                  {planKey(r)}{" "}
                  <span className="text-[12.5px] font-medium text-foreground/55">
                    · {periodLabel(r.billing_period)}
                  </span>
                </p>
                <p className="mt-1 text-[13px] text-foreground/60">
                  {r.points_cost.toLocaleString()} pts
                </p>
                <button
                  type="button"
                  onClick={() => redeem(r.slug)}
                  disabled={!affordable || busy === r.slug}
                  className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:bg-foreground/[0.07] disabled:text-foreground/55"
                >
                  {left === 0
                    ? "Sold out"
                    : busy === r.slug
                      ? "Redeeming…"
                      : affordable
                        ? "Redeem"
                        : `${(r.points_cost - points).toLocaleString()} pts to go`}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
