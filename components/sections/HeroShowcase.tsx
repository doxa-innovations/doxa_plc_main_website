"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Project } from "@/content/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 3800;

/** Resting transform for a card given its position relative to the active one. */
function variantFor(off: number, isHoveredCenter: boolean) {
  if (off === 0)
    return {
      x: "0%",
      y: isHoveredCenter ? -16 : 0,
      rotate: 0,
      scale: isHoveredCenter ? 1.07 : 1,
      opacity: 1,
    };
  if (off === -1)
    return { x: "-64%", y: 20, rotate: -7, scale: 0.82, opacity: 1 };
  if (off === 1) return { x: "64%", y: 20, rotate: 7, scale: 0.82, opacity: 1 };
  // Further cards stay hidden behind, ready to rotate in.
  return {
    x: off < 0 ? "-82%" : "82%",
    y: 28,
    rotate: off < 0 ? -10 : 10,
    scale: 0.7,
    opacity: 0,
  };
}

function CardFrame({ project, priority }: { project: Project; priority: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-deep shadow-[0_50px_120px_-40px_rgba(124,60,180,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image
          src={project.coverImage}
          alt={`${project.client}, ${project.title}`}
          fill
          sizes="(max-width:1024px) 90vw, 640px"
          className="object-cover"
          priority={priority}
        />
      </div>
    </div>
  );
}

/**
 * Auto-rotating "deck of cards" showcase. The cards continuously cycle which
 * project sits in the center (front). Hovering any visible card slides it to
 * the center and pops it; leaving the area resumes the rotation. Works for any
 * number of projects (only three are visible at a time).
 */
export function HeroShowcase({
  projects,
  initialIndex = 0,
}: {
  projects: Project[];
  initialIndex?: number;
}) {
  const reduce = useReducedMotion();
  const n = projects.length;
  const [active, setActive] = useState(initialIndex);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (reduce || hovered !== null || n < 2) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, hovered, n]);

  // Signed offset of card i from the active one, wrapped to the nearest side.
  function rel(i: number) {
    let d = ((i - active) % n + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  // Reduced motion: a single static centered card, no rotation.
  if (reduce) {
    return (
      <div className="relative mx-auto mt-16 flex h-[22rem] w-full max-w-4xl items-center justify-center sm:h-[26rem] lg:h-[28rem]">
        <div className="w-[78%] sm:w-[60%] lg:w-[54%]">
          <CardFrame project={projects[active]} priority />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto mt-16 h-[22rem] w-full max-w-4xl sm:h-[26rem] lg:h-[28rem]"
      onMouseLeave={() => setHovered(null)}
    >
      {projects.map((project, i) => {
        const off = rel(i);
        const visible = Math.abs(off) <= 1;
        const v = variantFor(off, hovered === i && off === 0);
        return (
          <div
            key={project.slug}
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: off === 0 ? 30 : 10 - Math.abs(off) }}
          >
            <motion.div
              className="w-[78%] cursor-pointer will-change-transform sm:w-[60%] lg:w-[54%]"
              style={{ pointerEvents: visible ? "auto" : "none" }}
              animate={v}
              transition={{ duration: 0.6, ease: EASE }}
              onMouseEnter={() => {
                setActive(i);
                setHovered(i);
              }}
            >
              <CardFrame project={project} priority={off === 0} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
