"use client";

import { Droplet, Package, Box, ShoppingBag, Coffee, HelpCircle } from "lucide-react";
import { clsx } from "clsx";

interface PlasticTypeIconProps {
  typeId: string;
  className?: string;
}

export default function PlasticTypeIcon({ typeId, className }: PlasticTypeIconProps) {
  const getIconData = (id: string) => {
    switch (id) {
      case "1": // PET
        return { icon: Droplet, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" };
      case "2": // HDPE
        return { icon: Box, color: "text-brand-green", bg: "bg-brand-green50" };
      case "4": // LDPE
        return { icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" };
      case "5": // PP
        return { icon: Coffee, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" };
      case "6": // PS
        return { icon: Package, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" };
      case "mix": // Campuran
      default:
        return { icon: HelpCircle, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800" };
    }
  };

  const { icon: Icon, color, bg } = getIconData(typeId);

  return (
    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", bg, className)}>
      <Icon className={clsx("w-5 h-5", color)} />
    </div>
  );
}
