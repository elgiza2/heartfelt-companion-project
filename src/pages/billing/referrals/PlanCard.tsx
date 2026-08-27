/** @doc Branded gift-card face used for every redeemable plan (Van Gogh art per plan). */
import logoMark from "@/assets/megsy-model-icon.png";
import starterArt from "@/assets/plan-starter-vg.jpg";
import proArt from "@/assets/plan-pro-vg.jpg";
import eliteArt from "@/assets/plan-elite-vg.jpg";

const ART: Record<string, string> = {
  starter: starterArt,
  pro: proArt,
  elite: eliteArt,
};

export default function PlanCard({
  plan,
  className = "",
}: {
  plan: string;
  className?: string;
}) {
  const art = ART[plan] ?? ART.starter;
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-[18px] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/20 ${className}`}
    >
      <img
        src={art}
        alt=""
        width={768}
        height={512}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25" />
      <div className="relative flex h-full flex-col justify-between p-3">
        <img
          src={logoMark}
          alt=""
          width={28}
          height={28}
          loading="lazy"
          className="h-6 w-6 rounded-md object-contain brightness-0 invert drop-shadow"
        />
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/80">
            Megsy
          </p>
          <p className="text-[15px] font-semibold capitalize leading-tight text-white drop-shadow">
            {plan}
          </p>
        </div>
      </div>
    </div>
  );
}
