import Image from "next/image";
import "@/app/candy-hand.css";

/** Decorative campaign cutout, rather than an exact SKU photograph. */
export function CandyHand({ className = "" }: { className?: string }) {
  return (
    <div className={`candy-hand ${className}`} aria-hidden="true">
      <Image
        className="candy-hand-photo"
        src="/generated/sour-belt-hand-v1.png"
        width={1536}
        height={1024}
        sizes="(max-width: 600px) 240px, 340px"
        alt=""
      />
    </div>
  );
}
