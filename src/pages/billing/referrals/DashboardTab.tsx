/** @doc Referrals overview — one screen: hero, points balance, quick stats. */
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import PlanCard from "./PlanCard";
import { POINTS_PER_SIGNUP, useReferrals } from "../ReferralsPage";
import { FALLBACK_REWARDS } from "./rewardsCatalog";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] px-4 py-3">
    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/50">
      {label}
    </p>
    <p className="mt-1 text-[20px] font-semibold tracking-tight text-foreground">{value}</p>
  </div>
);

export default function DashboardTab() {
  const navigate = useNavigate();
  const { signups, points, rewards } = useReferrals();

  const list = rewards.length ? rewards : FALLBACK_REWARDS;
  const cheapest = Math.min(...list.map((r) => Number(r.points_cost) || Infinity));
  const goal = Number.isFinite(cheapest) ? cheapest : 800;
  const pct = Math.max(0, Math.min(100, Math.round((points / goal) * 100)));
  const remaining = Math.max(0, goal - points);

  return (
    <div className="flex h-full flex-col justify-center gap-4" data-stagger>
      {/* Hero */}
      <section>
        <div className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[28px] border border-foreground/[0.08] bg-foreground/[0.03] sm:h-[185px]">
          <PlanCard
            plan="starter"
            className="absolute h-[96px] w-[140px] -translate-x-[86px] -rotate-[10deg] sm:h-[112px] sm:w-[164px] sm:-translate-x-[110px]"
          />
          <PlanCard
            plan="elite"
            className="absolute h-[96px] w-[140px] translate-x-[86px] rotate-[10deg] sm:h-[112px] sm:w-[164px] sm:translate-x-[110px]"
          />
          <PlanCard
            plan="pro"
            className="relative z-10 h-[108px] w-[156px] sm:h-[124px] sm:w-[180px]"
          />
        </div>

        <h1 className="mt-4 text-[26px] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-[30px]">
          Invite friends, earn points.
        </h1>
        <p className="mt-1.5 max-w-[360px] text-[13px] leading-relaxed text-foreground/60">
          Each friend who joins gives you {POINTS_PER_SIGNUP} points — trade them for a free
          subscription.
        </p>
      </section>


      {/* Points balance */}
      <section className="rounded-[24px] border border-foreground/[0.08] bg-foreground/[0.02] p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/50">
              Points balance
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-[38px] font-semibold leading-none tracking-tight text-foreground">
                {points}
              </span>
              <span className="pb-1 text-[13px] text-foreground/50">/ {goal}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/settings/referrals/rewards")}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-foreground/12 bg-foreground/[0.04] px-4 text-[13.5px] font-medium text-foreground transition hover:bg-foreground/[0.08] active:scale-[0.98]"
          >
            Redeem
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.08]">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2.5 text-[12.5px] text-foreground/55">
          {remaining === 0
            ? "You can redeem a free plan now."
            : `${remaining} points to go — about ${Math.ceil(remaining / POINTS_PER_SIGNUP)} more friends.`}
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Friends joined" value={String(signups)} />
        <Stat label="Points earned" value={String(points)} />
      </div>
    </div>
  );
}
