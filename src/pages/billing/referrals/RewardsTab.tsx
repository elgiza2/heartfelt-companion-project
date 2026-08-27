/** @doc Redemption page — spend referral points on subscription plans. */
import { useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import { POINTS_PER_SIGNUP, useReferrals } from "../ReferralsPage";
import {
  FALLBACK_REWARDS,
  type CatalogRow,
  periodLabel,
  planArt,
  planKey,
} from "./rewardsCatalog";

export default function RewardsTab() {
  const { points, rewards, redeemReward } = useReferrals();
  const [busy, setBusy] = useState<string | null>(null);

  const list = rewards.length > 0 ? (rewards as unknown as CatalogRow[]) : FALLBACK_REWARDS;
  const shown = useMemo(
    () =>
      [...list]
        .filter((r) => (r.category ?? "plan") === "plan")
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
      {/* Balance header */}
      <div className="relative overflow-hidden rounded-[22px] border border-foreground/[0.08] p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 120% at 0% 0%, hsl(var(--primary) / 0.16), transparent 62%)",
          }}
        />
        <div className="relative flex items-end justify-between gap-4">
          <div>
            <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-foreground/65">
              Your points
            </p>
            <p className="mt-1 text-[38px] font-semibold leading-none tracking-tight text-foreground">
              {points}
            </p>
            <p className="mt-1.5 text-[12.5px] text-foreground/65">
              +{POINTS_PER_SIGNUP} points for every friend who signs up
            </p>
          </div>
          <div className="text-right">
            <p className="text-[12px] text-foreground/65">Plans left</p>
            <p className="text-[20px] font-semibold text-foreground">
              {shown.reduce((s, r) => s + Math.max(0, r.stock_total - r.stock_claimed), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Catalogue */}
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((r) => {
          const left = Math.max(0, r.stock_total - r.stock_claimed);
          const affordable = points >= r.points_cost && left > 0;
          const progress = Math.min(100, Math.round((points / r.points_cost) * 100));
          const art = planArt(r);
          return (
            <article
              key={r.slug}
              className="ng-lift flex flex-col overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-foreground/[0.025]"
            >
              {/* Plan card artwork — clean gradient + pills */}
              <div className="p-3">
                <div
                  className="relative flex h-[136px] flex-col justify-between overflow-hidden rounded-[18px] border border-foreground/[0.08] p-4"
                  style={{ background: art.gradient }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[19px] font-semibold capitalize tracking-tight text-foreground">
                      {planKey(r)}
                    </span>
                    <span className="rounded-full border border-foreground/12 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/75 backdrop-blur">
                      {periodLabel(r.billing_period)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {art.pills.map((p) => (
                      <span
                        key={p}
                        className="rounded-full border border-foreground/10 bg-background/55 px-2.5 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4">
                <p className="text-[15px] font-semibold text-foreground">
                  {r.title.includes("—") ? r.title : `${r.title} — ${periodLabel(r.billing_period)}`}
                </p>
                {r.description ? (
                  <p className="mt-1 text-[13px] leading-relaxed text-foreground/65">
                    {r.description}
                  </p>
                ) : null}

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.09]">
                  <div
                    className="h-full rounded-full bg-primary transition-[width] duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[20px] font-semibold leading-none text-foreground">
                      {r.points_cost.toLocaleString()}
                      <span className="ml-1 text-[12px] font-medium text-foreground/65">pts</span>
                    </p>
                    <p className="mt-1 text-[12px] text-foreground/65">{left} left</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => redeem(r.slug)}
                    disabled={!affordable || busy === r.slug}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:bg-foreground/[0.08] disabled:text-foreground/55"
                  >
                    {left === 0 ? (
                      "Sold out"
                    ) : busy === r.slug ? (
                      "Redeeming…"
                    ) : affordable ? (
                      <>
                        <Check className="h-4 w-4" />
                        Redeem
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        {r.points_cost - points} pts to go
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
