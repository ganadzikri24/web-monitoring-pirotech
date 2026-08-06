"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { mockChartData } from '@/lib/mockData';

export default function RealtimeChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  // Recharts needs explicit hex colors or rgba, var(--color) works but has issues in some SVGs
  const strokeColor = isDark ? "#4ade80" : "#4D8942"; // brand-green
  const gridColor = isDark ? "#1f2937" : "#EEF2EF"; // card-border equivalent
  const textColor = isDark ? "#9ca3af" : "#687C63"; // brand-sage equivalent

  // TODO: hapus mock auth & mock data setelah Firebase disetup
  const data = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true' 
    ? mockChartData 
    : [
        { time: '10:00', temp: 200 },
        { time: '10:05', temp: 250 },
        { time: '10:10', temp: 300 },
        { time: '10:15', temp: 320 },
        { time: '10:20', temp: 325 },
      ];

  if (!mounted) return <div className="w-full h-full animate-pulse bg-card-bg rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis 
          dataKey="time" 
          stroke={textColor} 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis 
          stroke={textColor} 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}°`}
          dx={-10}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '16px', 
            border: '1px solid var(--card-border)', 
            backgroundColor: 'var(--card-bg)',
            color: 'var(--foreground)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
          }}
          labelStyle={{ color: strokeColor, fontWeight: 'bold', marginBottom: '4px' }}
          itemStyle={{ color: 'var(--foreground)' }}
        />
        <Line 
          type="monotone" 
          dataKey="temp" 
          name="Suhu"
          stroke={strokeColor} 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: 'var(--card-bg)', stroke: strokeColor }}
          activeDot={{ r: 6, fill: strokeColor, stroke: 'var(--card-bg)' }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
