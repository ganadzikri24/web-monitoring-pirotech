"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { mockChartData } from '@/lib/mockData';
import { useRole } from "@/lib/useRole";

export default function RealtimeChart() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [chartData, setChartData] = useState<{ time: string; temp: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Import helper dinamis di client-side (opsional, tapi bagus untuk menghindari error SSR dengan Firebase)
    import('@/lib/firebaseUtils').then(({ listenToMonitoring }) => {
      const unsubscribe = listenToMonitoring((data) => {
        if (data && typeof data.suhu === 'number') {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          
          setChartData(prev => {
            const newData = [...prev, { time: timeStr, temp: data.suhu }];
            // Simpan maksimal 20 titik terakhir agar grafik tidak terlalu padat
            if (newData.length > 20) {
              return newData.slice(newData.length - 20);
            }
            return newData;
          });
        }
      });
      
      // Cleanup
      return () => unsubscribe();
    });
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const strokeColor = isDark ? "#4ade80" : "#4D8942";
  const gridColor = isDark ? "#1f2937" : "#EEF2EF";
  const textColor = isDark ? "#9ca3af" : "#687C63";

  const data = chartData.length > 0 ? chartData : [{ time: 'Menunggu data...', temp: 0 }];

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
