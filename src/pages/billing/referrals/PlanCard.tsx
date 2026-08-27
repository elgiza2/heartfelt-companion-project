/** @doc Branded gift-card face used for every redeemable plan. */
import logoMark from "@/assets/megsy-model-icon.png";

const FACES: Record<string, string> = {
  starter: "linear-gradient(135deg,#5b6bff 0%,#8f5bff 45%,#ff5ea8 100%)",
  pro: "linear-gradient(135deg,#ff8a00 0%,#ff2e83 55%,#a628ff 100%)",
  elite: "linear-gradient(135deg,#111114 0%,#2a2140 45%,#0b6bff 100%)",
};

export default function PlanCard({
  plan,
  className = "",
}: {
  plan: string;
  className?: string;
}) {
  const face = FACES[plan] ?? FACES.starter;
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-[18px] p-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ${className}`}
      style={{ background: face }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle,rgba(255,255,255,0.75),transparent 70%)" }}
      />
      <img
        src={logoMark}
        alt=""
        width={28}
        height={28}
        loading="lazy"
        className="h-6 w-6 rounded-md object-contain brightness-0 invert"
      />
      <div className="relative">
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">Megsy</p>
        <p className="text-[15px] font-semibold capitalize leading-tight text-white">{plan}</p>
      </div>
    </div>
  );
}
