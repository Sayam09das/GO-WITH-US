import gsap from "gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

/** Subtle editorial parallax speeds — see docs/ANIMATION_GUIDELINES.md §22 */
export const PARALLAX_SHIFT = {
  slow: 16,
  medium: 26,
  fast: 38,
} as const;

type ParallaxSpeed = keyof typeof PARALLAX_SHIFT;

interface ParallaxOptions {
  trigger: Element;
  speed?: ParallaxSpeed;
  scrub?: number;
}

/** Scroll-linked vertical drift using transform only (compositor-friendly). */
export function bindParallax(
  element: Element,
  { trigger, speed = "medium", scrub = 1 }: ParallaxOptions,
): ScrollTrigger {
  const shift = PARALLAX_SHIFT[speed];

  return gsap.fromTo(
    element,
    { y: -shift * 0.3 },
    {
      y: shift * 0.7,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top bottom",
        end: "bottom top",
        scrub,
      },
    },
  ).scrollTrigger as ScrollTrigger;
}

interface LayerParallaxOptions {
  root: Element;
  layerSelector: string;
  speedAttribute?: string;
}

/** Bind parallax to layers marked with a speed data attribute inside a root. */
export function bindLayerParallax({
  root,
  layerSelector,
  speedAttribute = "data-parallax-speed",
}: LayerParallaxOptions): void {
  const layers = root.querySelectorAll(layerSelector);

  for (const layer of layers) {
    const speed = (layer.getAttribute(speedAttribute) ?? "medium") as ParallaxSpeed;
    bindParallax(layer, { trigger: root, speed });
  }
}

/** Gentle fade + lift as a section scrolls out of view. */
export function bindSectionScrollOut(element: Element, trigger: Element): ScrollTrigger {
  return gsap.fromTo(
    element,
    { y: 0, opacity: 1 },
    {
      y: 28,
      opacity: 0.82,
      ease: "none",
      scrollTrigger: {
        trigger,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    },
  ).scrollTrigger as ScrollTrigger;
}
