import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    viewTransition: true,
  },
  images: {
    /**
     * Next's default deviceSizes top out at 3840. The gallery originals are
     * 2560px wide, so on a retina screen the browser was asking Cloudinary for
     * a 3840px variant of a 2560px photo — an upscale that renders nothing new,
     * takes seconds to derive on first request (which is why some lightbox
     * images appeared blank), and spends a transformation credit each time.
     *
     * 2048 is the largest width worth serving here: the lightbox frame never
     * exceeds ~1100 CSS px, so 2048 already covers 2x.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
