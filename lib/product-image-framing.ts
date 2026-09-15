/** Visible alpha bounds of the existing 1254px product cutouts (alpha > 40).
 * Keep the original pixels; normalize their presentation rather than stretching bags.
 */
export const productImageFrames: Record<
  string,
  { bounds: readonly [number, number, number, number]; size: number }
> = {
  '/generated/rainbow-mix-launch.png': {
    bounds: [227, 55, 1024, 1191],
    size: 1254,
  },
  '/generated/blue-raspberry-launch.png': {
    bounds: [399, 55, 938, 1140],
    size: 1254,
  },
  '/generated/chamoy-heatwave-launch.png': {
    bounds: [267, 66, 984, 1199],
    size: 1254,
  },
  '/generated/gummy-bear-party-launch.png': {
    bounds: [165, 17, 1089, 1233],
    size: 1254,
  },
  '/generated/chocolate-crunch-bark-launch.png': {
    bounds: [318, 126, 941, 1091],
    size: 1254,
  },
  '/generated/spicy-gummy-bears-launch.png': {
    bounds: [187, 15, 1065, 1239],
    size: 1254,
  },
};
