/** @doc Redemption page — spend referral points on credits, packs and plans. */
import { useMemo, useState } from "react";
import { Check, Lock } from "lucide-react";
import { POINTS_PER_SIGNUP, useReferrals } from "../ReferralsPage";
import { FALLBACK_REWARDS, type CatalogRow, periodLabel, rewardImage } from "./rewardsCatalog";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "credits", label: "Credits" },
  { key: "pack", label: "Packs" },
  { key: "plan", label: "Plans" },
] as const;

export default function RewardsTab() {
  const { points, rewards, redeemReward } = useReferrals();
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const list = (rewards.length > 0 ? (rewards as unknown as CatalogRow[]) : FALLBACK_REWARDS);
  const shown = useMemo(
    () =>
      [...list]
        .filter((r) => filter === "all" || (r.category ?? "plan") === filter)
        .sort((a, b) => a.points_cost - b.points_cost),
    [list, filter],
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
            <p className="text-[12px] text-foreground/65">Rewards left</p>
            <p className="text-[20px] font-semibold text-foreground">
              {list.reduce((s, r) => s + Math.max(0, r.stock_total - r.stock_claimed), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              filter === f.key
                ? "border-transparent bg-foreground text-background"
                : "border-foreground/10 bg-foreground/[0.04] text-foreground/70"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Catalogue */}
      <div className="grid gap-3 sm:grid-cols-2">
        {shown.map((r) => {
          const left = Math.max(0, r.stock_total - r.stock_claimed);
          const affordable = points >= r.points_cost && left > 0;
          const progress = Math.min(100, Math.round((points / r.points_cost) * 100));
          return (
            <article
              key={r.slug}
              className="ng-lift flex flex-col overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-foreground/[0.025]"
            >
              <div className="relative grid h-[132px] place-items-center bg-foreground/[0.04]">
                <img
                  src={rewardImage(r)}
                  alt={r.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-[104px] w-auto object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.25)]"
                />
                <span className="absolute right-3 top-3 rounded-full border border-foreground/10 bg-background/70 px-2.5 py-1 text-[11px] font-medium text-foreground/75 backdrop-blur">
                  {periodLabel(r.billing_period)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="text-[15px] font-semibold text-foreground">{r.title}</p>
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
