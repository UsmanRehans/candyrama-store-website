import Image from 'next/image';
import { productImageFrames } from '@/lib/product-image-framing';

/** A common square presentation frame, with equal visible heights and baselines.
 * SVG positions the original transparent PNG without resampling or redrawing it.
 */
export function ProductPhoto({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const frame = productImageFrames[src];
  if (!frame)
    return (
      <Image
        className="product-photo"
        src={src}
        alt={alt}
        width={520}
        height={520}
        priority={priority}
        unoptimized
      />
    );
  const [left, top, right, bottom] = frame.bounds;
  const scale = 880 / (bottom - top);
  const x = 500 - ((left + right) / 2) * scale;
  const y = 940 - bottom * scale;
  return (
    <svg
      className="product-photo"
      viewBox="0 0 1000 1000"
      width="1000"
      height="1000"
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      focusable="false"
    >
      <image
        href={src}
        x={x}
        y={y}
        width={frame.size * scale}
        height={frame.size * scale}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}
