/** @doc Referrals overview — points balance, quiet stats, recent activity. */
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import {
  EmptyState,
  MIN_PAYOUT,
  POINTS_PER_SIGNUP,
  fmtDate,
  statusLabel,
  statusTone,
  useReferrals,
} from "../ReferralsPage";

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

const Stat = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <Panel className="ng-lift p-4">
    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/65">
      {label}
    </p>
    <p className="mt-1.5 text-[24px] font-semibold tracking-tight text-foreground">{value}</p>
    {hint ? <p className="mt-0.5 text-[11.5px] text-foreground/65">{hint}</p> : null}
  </Panel>
);

/** Circular progress ring for the points goal. */
const PointsRing = ({ pct }: { pct: number }) => {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 110 110" className="h-[112px] w-[112px] shrink-0 -rotate-90">
      <circle cx="55" cy="55" r={r} fill="none" strokeWidth="8" stroke="hsl(var(--foreground) / 0.09)" />
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        stroke="hsl(var(--primary))"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
      />
    </svg>
  );
};

export default function DashboardTab() {
  const navigate = useNavigate();
  const { signups, totalEarned, available, points, refs, wds, rewards } = useReferrals();

  const cheapest = rewards.length
    ? Math.min(...rewards.map((r) => Number(r.points_cost) || 0).filter((n) => n > 0))
    : 100;
  const goal = cheapest || 100;
  const pct = Math.max(0, Math.min(100, Math.round((points / goal) * 100)));
  const remaining = Math.max(0, goal - points);

  return (
    <div className="space-y-4 pb-10" data-stagger>
      {/* Points balance — hero tile */}
      <Panel className="relative overflow-hidden p-5 md:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 120% at 100% 0%, hsl(var(--primary) / 0.14), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative grid place-items-center">
            <PointsRing pct={pct} />
            <span className="absolute text-[13px] font-semibold tabular-nums text-foreground">
              {pct}%
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-foreground/65">
              Points balance
            </p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-[44px] font-semibold leading-none tracking-tight text-foreground">
                {points}
              </span>
              <span className="pb-1.5 text-[13px] text-foreground/65">/ {goal} for a free plan</span>
            </div>
            <p className="mt-2 text-[13px] text-foreground/70">
              {remaining === 0
                ? "You can redeem a plan now."
                : `${remaining} points to go — ${Math.ceil(remaining / POINTS_PER_SIGNUP)} more friends.`}
            </p>
            <button
              type="button"
              onClick={() => navigate("/settings/referrals/rewards")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-foreground/10 bg-foreground/[0.05] px-3 py-1.5 text-[13px] font-medium text-foreground"
            >
              Browse rewards
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Panel>

      {/* Stats bento */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Stat label="Friends" value={String(signups)} />
        <Stat label="Earned" value={`$${totalEarned.toFixed(2)}`} />
        <Stat
          label="Available"
          value={`$${available.toFixed(2)}`}
          hint={`min $${MIN_PAYOUT}`}
        />
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
              <div
                key={r.id}
                data-row
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-foreground/[0.07] text-[12px] font-semibold text-foreground/70">
                    {fmtDate(r.created_at).slice(0, 3)}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-foreground">New signup</p>
                    <p className="text-[12px] text-foreground/65">{fmtDate(r.created_at)}</p>
                  </div>
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

      {wds.length > 0 && (
        <section>
          <h2 className="mb-2 px-1 text-[11.5px] font-medium uppercase tracking-[0.12em] text-foreground/65">
            Withdrawals
          </h2>
          <Panel className="divide-y divide-foreground/[0.07]">
            {wds.slice(0, 5).map((w) => (
              <div key={w.id} data-row className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-[14px] font-medium text-foreground">
                    ${Number(w.amount).toFixed(2)}
                  </p>
                  <p className="text-[12px] text-foreground/65">{fmtDate(w.created_at)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ring-1 ${statusTone(w.status)}`}
                >
                  {statusLabel(w.status)}
                </span>
              </div>
            ))}
          </Panel>
        </section>
      )}
    </div>
  );
}

