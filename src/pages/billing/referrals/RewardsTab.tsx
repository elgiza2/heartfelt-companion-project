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
    <div className="mx-auto w-full max-w-[560px] space-y-7 pb-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => goBackOr(navigate, "/settings/referrals")}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent active:scale-95"
        >
          <ArrowLeft className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </button>
        <div className="ml-auto rounded-full border border-foreground/10 bg-foreground/[0.04] px-3.5 py-1.5 text-[13px] font-semibold tabular-nums text-foreground">
          {points.toLocaleString()} pts
        </div>
      </div>

      <header>
        <h1 className="text-[27px] font-semibold tracking-tight text-foreground">Redeem</h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/55">
          Spend your points on a free month of any plan.
        </p>
      </header>

      <ul className="space-y-4">
        {shown.map((r) => {
          const left = Math.max(0, r.stock_total - r.stock_claimed);
          const affordable = points >= r.points_cost && left > 0;
          const progress = Math.min(100, Math.round((points / r.points_cost) * 100));
          return (
            <li
              key={r.slug}
              className="overflow-hidden rounded-[26px] border border-foreground/[0.09] bg-foreground/[0.02]"
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden">
                <img
                  src={planImage(r)}
                  alt={`${planKey(r)} plan`}
                  width={1024}
                  height={640}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
                <span className="absolute bottom-3 left-4 text-[19px] font-semibold capitalize tracking-tight text-foreground">
                  {planKey(r)}
                </span>
                <span className="absolute bottom-3.5 right-4 rounded-full border border-foreground/15 bg-background/70 px-2.5 py-1 text-[11.5px] font-semibold tabular-nums text-foreground backdrop-blur">
                  {r.points_cost.toLocaleString()} pts
                </span>
              </div>

              <div className="space-y-3 p-4">
                <p className="text-[13px] leading-relaxed text-foreground/60">
                  {r.description ?? `${periodLabel(r.billing_period)} of ${planKey(r)}.`}
                </p>

                {!affordable && left > 0 && (
                  <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
                    <div
                      className="h-full rounded-full bg-foreground/45 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => redeem(r.slug)}
                  disabled={!affordable || busy === r.slug}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground text-[13.5px] font-semibold text-background transition active:scale-[0.985] disabled:cursor-not-allowed disabled:bg-foreground/[0.07] disabled:text-foreground/50"
                >
                  {left === 0
                    ? "Sold out"
                    : busy === r.slug
                      ? "Redeeming…"
                      : affordable
                        ? `Redeem · ${periodLabel(r.billing_period)}`
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
