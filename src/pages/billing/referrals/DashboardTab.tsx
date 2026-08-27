/** @doc Referrals overview — single-screen: ticket hero, points balance, quick stats. */
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Gift } from "lucide-react";
import ticket from "@/assets/referral/gold-ticket.png";
import { POINTS_PER_SIGNUP, COMMISSION_PCT, useReferrals } from "../ReferralsPage";
import { FALLBACK_REWARDS } from "./rewardsCatalog";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-[18px] border border-foreground/[0.08] bg-foreground/[0.025] px-3 py-2.5 text-center">
    <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-foreground/60">
      {label}
    </p>
    <p className="mt-0.5 text-[18px] font-semibold tracking-tight text-foreground">{value}</p>
  </div>
);

export default function DashboardTab() {
  const navigate = useNavigate();
  const { signups, totalEarned, available, points, rewards } = useReferrals();

  const list = rewards.length ? rewards : FALLBACK_REWARDS;
  const cheapest = Math.min(...list.map((r) => Number(r.points_cost) || Infinity));
  const goal = Number.isFinite(cheapest) ? cheapest : 150;
  const pct = Math.max(0, Math.min(100, Math.round((points / goal) * 100)));
  const remaining = Math.max(0, goal - points);

  return (
    <div className="flex h-full flex-col justify-center gap-4" data-stagger>
      {/* Hero */}
      <section className="text-center">
        <img
          src={ticket}
          alt="Golden referral ticket"
          width={1024}
          height={768}
          className="mx-auto h-[104px] w-auto object-contain drop-shadow-[0_16px_26px_rgba(0,0,0,0.28)] sm:h-[124px]"
        />
        <span className="mt-3 inline-flex items-center rounded-full bg-primary px-3.5 py-1 text-[12px] font-medium text-primary-foreground">
          Limited time offer
        </span>
        <h1 className="mx-auto mt-2.5 max-w-[480px] font-serif text-[27px] leading-[1.1] tracking-tight text-foreground sm:text-[34px]">
          Refer friends, redeem real rewards.
        </h1>
        <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-relaxed text-foreground/65">
          Every friend who joins gives you {POINTS_PER_SIGNUP} points and {COMMISSION_PCT}%
          commission. Spend points on a free subscription.
        </p>
      </section>

      {/* Points balance */}
      <section className="relative overflow-hidden rounded-[22px] border border-foreground/[0.08] bg-foreground/[0.025] p-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 120% at 100% 0%, hsl(var(--primary) / 0.14), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/65">
                Points balance
              </p>
              <div className="mt-0.5 flex items-end gap-2">
                <span className="text-[34px] font-semibold leading-none tracking-tight text-foreground">
                  {points}
                </span>
                <span className="pb-0.5 text-[12.5px] text-foreground/65">/ {goal} pts</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/settings/referrals/rewards")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/10 bg-foreground/[0.05] px-3 py-2 text-[13px] font-medium text-foreground"
            >
              <Gift className="h-3.5 w-3.5" />
              Redeem
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-foreground/[0.09]">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-foreground/70">
            {remaining === 0
              ? "You can redeem a free plan now."
              : `${remaining} points to your first plan — ${Math.ceil(remaining / POINTS_PER_SIGNUP)} more friends.`}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <Stat label="Friends" value={String(signups)} />
        <Stat label="Earned" value={`$${totalEarned.toFixed(2)}`} />
        <Stat label="Available" value={`$${available.toFixed(2)}`} />
      </div>
    </div>
  );
}
