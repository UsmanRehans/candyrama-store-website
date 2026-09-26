import Image from "next/image";
import type { CSSProperties } from "react";

const pouchImages = [
  "/generated/spicy-gummy-bears-pink-v1.png",
  "/generated/gummy-bear-party-pink-v1.png",
  "/generated/blue-raspberry-pink-v1.png",
  "/generated/rainbow-mix-pink-v1.png",
];

export function PickFourMotion() {
  return (
    <div className="pick-four-motion" aria-hidden="true">
      <div className="pick-four-pouches">
        {pouchImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={1254}
            height={1254}
            sizes="96px"
            style={{ "--pouch-index": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="pick-four-box">
        <span />
      </div>
    </div>
  );
}
