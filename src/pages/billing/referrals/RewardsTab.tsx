/** @doc Redemption page — a clean, uncluttered list of subscription rewards. */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock } from "lucide-react";
import redeemSky from "@/assets/referral/redeem-sky.jpg";
import { useReferrals } from "../ReferralsPage";
import { FALLBACK_REWARDS, type CatalogRow, periodLabel, planKey } from "./rewardsCatalog";

export default function RewardsTab() {
  const navigate = useNavigate();
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
    <div className="space-y-4 pb-4">
      <button
        type="button"
        onClick={() => navigate("/settings/referrals")}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.04] px-3 text-[13px] font-medium text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Balance */}
      <section className="overflow-hidden rounded-[22px] border border-foreground/[0.08]">
        <img
          src={redeemSky}
          alt="Floating crown and points in a blue sky"
          width={1408}
          height={768}
          loading="lazy"
          className="h-[120px] w-full object-cover"
        />
        <div className="px-4 py-3.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/60">
            Your points
          </p>
          <p className="mt-0.5 text-[32px] font-semibold leading-none tracking-tight text-foreground">
            {points}
          </p>
        </div>
      </section>

      {/* Catalogue — one clean row per plan */}
      <ul className="divide-y divide-foreground/[0.07] overflow-hidden rounded-[22px] border border-foreground/[0.08]">
        {shown.map((r) => {
          const left = Math.max(0, r.stock_total - r.stock_claimed);
          const affordable = points >= r.points_cost && left > 0;
          return (
            <li key={r.slug} className="flex items-center gap-3 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold capitalize text-foreground">
                  {planKey(r)}{" "}
                  <span className="text-[12.5px] font-medium text-foreground/55">
                    · {periodLabel(r.billing_period)}
                  </span>
                </p>
                <p className="mt-0.5 text-[12.5px] text-foreground/60">
                  {r.points_cost.toLocaleString()} pts
                </p>
              </div>
              <button
                type="button"
                onClick={() => redeem(r.slug)}
                disabled={!affordable || busy === r.slug}
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-[13px] font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:bg-foreground/[0.07] disabled:text-foreground/55"
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
                    {(r.points_cost - points).toLocaleString()} pts to go
                  </>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
