"use client";

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function CountUp({ value, duration = 1.2, formatter, className }: CountUpProps) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(formatter ? formatter(latest) : Math.round(latest).toLocaleString("fr-FR"));
  });

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: hasAnimated.current ? 0.6 : duration,
      ease: "easeOut",
    });
    hasAnimated.current = true;
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display}</span>;
}
