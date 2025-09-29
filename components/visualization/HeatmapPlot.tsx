"use client";

import { useEffect, useRef } from 'react';

interface HeatmapPlotProps {
  data: any[];
}

export function HeatmapPlot({ data }: HeatmapPlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const renderPlot = () => {
      if (!plotRef.current) return;
      
      plotRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-200">
          <div class="text-center">
            <div class="text-lg font-semibold text-foreground mb-2">Sea Surface Temperature Heatmap</div>
            <div class="text-sm text-muted-foreground">${data.length} grid points in the Arabian Sea</div>
            <div class="mt-4 text-xs text-slate-600">
              <div>Latitude: -10° to 10°</div>
              <div>Longitude: 60° to 80°</div>
              <div>Temperature range: 24-30°C</div>
            </div>
          </div>
        </div>
      `;
    };

    renderPlot();
  }, [data]);

  return (
    <div className="w-full h-full">
      <div ref={plotRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}