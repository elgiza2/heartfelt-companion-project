/** @doc Referrals overview — ticket hero, points balance, earning steps, activity. */
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Gift } from "lucide-react";
import ticket from "@/assets/referral/gold-ticket.png";
import {
  EmptyState,
  POINTS_PER_SIGNUP,
  COMMISSION_PCT,
  fmtDate,
  statusLabel,
  statusTone,
  useReferrals,
} from "../ReferralsPage";
import { FALLBACK_REWARDS } from "./rewardsCatalog";

const Panel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-[22px] border border-foreground/[0.08] bg-foreground/[0.025] ${className}`}>
    {children}
  </div>
);

const Step = ({
  n,
  title,
  body,
  last,
}: {
  n: number;
  title: string;
  body: string;
  last?: boolean;
}) => (
  <div className="relative flex gap-4 pb-6 last:pb-0">
    {!last && (
      <span
        aria-hidden="true"
        className="absolute left-[19px] top-10 bottom-1 w-[2px] rounded-full bg-foreground/[0.10]"
      />
    )}
    <span className="relative z-[1] grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-[14px] font-semibold text-background">
      {n}
    </span>
    <div className="min-w-0 pt-1.5">
      <p className="text-[15px] font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-[13.5px] leading-relaxed text-foreground/65">{body}</p>
    </div>
  </div>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Panel className="ng-lift p-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/65">{label}</p>
    <p className="mt-1.5 text-[22px] font-semibold tracking-tight text-foreground">{value}</p>
  </Panel>
);

export default function DashboardTab() {
  const navigate = useNavigate();
  const { signups, totalEarned, available, points, refs, rewards } = useReferrals();

  const list = rewards.length ? rewards : FALLBACK_REWARDS;
  const cheapest = Math.min(...list.map((r) => Number(r.points_cost) || Infinity));
  const goal = Number.isFinite(cheapest) ? cheapest : 100;
  const pct = Math.max(0, Math.min(100, Math.round((points / goal) * 100)));
  const remaining = Math.max(0, goal - points);

  return (
    <div className="space-y-6 pb-4" data-stagger>
      {/* Hero — ticket + editorial headline */}
      <section className="text-center">
        <img
          src={ticket}
          alt="Golden free-for-life referral ticket"
          width={1024}
          height={768}
          className="mx-auto h-[150px] w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.28)] md:h-[180px]"
        />
        <span className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-[13px] font-medium text-primary-foreground">
          Limited time offer
        </span>
        <h1 className="mx-auto mt-4 max-w-[520px] font-serif text-[34px] leading-[1.08] tracking-tight text-foreground md:text-[44px]">
          Refer friends, redeem
          <br />
          real rewards.
        </h1>
        <p className="mx-auto mt-3 max-w-[440px] text-[14.5px] leading-relaxed text-foreground/65">
          Every friend who joins gives you {POINTS_PER_SIGNUP} points and {COMMISSION_PCT}%
          commission. Spend the points on credits, packs or a free plan.
        </p>
      </section>

      {/* Points balance */}
      <Panel className="relative overflow-hidden p-5">
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
              <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-foreground/65">
                Points balance
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[40px] font-semibold leading-none tracking-tight text-foreground">
                  {points}
                </span>
                <span className="pb-1 text-[13px] text-foreground/65">/ {goal} pts</span>
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

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-foreground/[0.09]">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] text-foreground/70">
            {remaining === 0
              ? "You can redeem your first reward now."
              : `${remaining} points to your first reward — ${Math.ceil(remaining / POINTS_PER_SIGNUP)} more friends.`}
          </p>
        </div>
      </Panel>

      {/* Steps */}
      <Panel className="p-5">
        <Step
          n={1}
          title={`${POINTS_PER_SIGNUP} points per friend`}
          body="Share your unique link. Each friend who creates an account credits your points balance."
        />
        <Step
          n={2}
          title={`${COMMISSION_PCT}% cash commission`}
          body="When a friend upgrades, you also earn a cash commission you can withdraw."
        />
        <Step
          n={3}
          last
          title="Redeem your points"
          body="Trade points for credits, image and video packs, or a completely free plan."
        />
      </Panel>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Friends" value={String(signups)} />
        <Stat label="Earned" value={`$${totalEarned.toFixed(2)}`} />
        <Stat label="Available" value={`$${available.toFixed(2)}`} />
      </div>

      {/* Recent signups */}
      <section>
        <h2 className="mb-2 px-1 text-[11.5px] font-medium uppercase tracking-[0.12em] text-foreground/65">
          Recent signups
        </h2>
        <Panel className="divide-y divide-foreground/[0.07]">
          {refs.length === 0 ? (
            <EmptyState title="No signups yet" hint="Share your link to get your first referral." />
          ) : (
            refs.slice(0, 8).map((r) => (
              <div key={r.id} data-row className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-[14px] font-medium text-foreground">New signup</p>
                  <p className="text-[12px] text-foreground/65">{fmtDate(r.created_at)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 ${statusTone(r.status)}`}
                >
                  {statusLabel(r.status)}
                </span>
              </div>
            ))
          )}
        </Panel>
      </section>
    </div>
  );
}
