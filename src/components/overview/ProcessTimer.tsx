"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface ProcessTimerProps {
  startTs: number | null;
  endTs?: number | null;
  pausedAt?: number | null;
  accumulatedMs?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ProcessTimer({
  startTs,
  endTs,
  pausedAt,
  accumulatedMs = 0,
  className = "",
  size = "md",
}: ProcessTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTs) {
      setElapsed(0);
      return;
    }

    // Process is completed/stopped → show final accumulated time
    if (endTs) {
      setElapsed(accumulatedMs);
      return;
    }

    // Process is paused → show frozen accumulated time
    if (pausedAt) {
      setElapsed(accumulatedMs);
      return;
    }

    // Process is running → show accumulated + current segment
    const updateElapsed = () => {
      const currentSegment = Date.now() - startTs;
      setElapsed(accumulatedMs + currentSegment);
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startTs, endTs, pausedAt, accumulatedMs]);

  const formatTime = (ms: number) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const sizes = {
    sm: "text-sm",
    md: "text-2xl font-bold",
    lg: "text-4xl font-extrabold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (!startTs) return null;

  return (
    <div className={`flex items-center gap-2 font-mono ${className}`}>
      <Clock className={`${iconSizes[size]} text-brand-sage`} />
      <span className={`${sizes[size]} tabular-nums tracking-tight`}>
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
