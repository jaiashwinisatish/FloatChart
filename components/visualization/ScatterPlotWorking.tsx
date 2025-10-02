"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Scatter as ScatterIcon, Thermometer, Droplets, Gauge, Waves } from 'lucide-react';

interface ScatterPlotProps {
  data: any[];
}

export function ScatterPlot({ data }: ScatterPlotProps) {
  const [xAxis, setXAxis] = useState<'temperature' | 'salinity' | 'depth' | 'oxygen'>('temperature');
  const [yAxis, setYAxis] = useState<'temperature' | 'salinity' | 'depth' | 'oxygen'>('salinity');
  const [colorBy, setColorBy] = useState<'depth' | 'float_id' | 'oxygen'>('depth');
  
  const parameters = [
    { key: 'temperature', name: 'Temperature', unit: '°C', icon: <Thermometer className="w-3 h-3" /> },
    { key: 'salinity', name: 'Salinity', unit: 'PSU', icon: <Droplets className="w-3 h-3" /> },
    { key: 'depth', name: 'Depth', unit: 'm', icon: <Waves className="w-3 h-3" /> },
    { key: 'oxygen', name: 'Oxygen', unit: 'μmol/kg', icon: <Gauge className="w-3 h-3" /> }
  ];

  // Process data for scatter plot
  const processedData = data.map((point, index) => ({
    ...point,
    x: point[xAxis],
    y: point[yAxis],
    z: point[colorBy] || point.depth || 0,
    index
  })).filter(point => point.x != null && point.y != null);

  // Generate colors based on the colorBy parameter
  const getColor = (value: number, min: number, max: number) => {
    if (max === min) return '#2563eb'; // Blue-600
    const ratio = (value - min) / (max - min);
    // Use a color scale from blue to red, avoiding yellow
    const hue = (1 - ratio) * 220 + 20; // Blue (240) to red (20), skipping yellow range
    return `hsl(${hue}, 65%, 45%)`;
  };

  const colorValues = processedData.map(d => d.z).filter(v => v != null);
  const minColor = colorValues.length > 0 ? Math.min(...colorValues) : 0;
  const maxColor = colorValues.length > 0 ? Math.max(...colorValues) : 1;

  const xParam = parameters.find(p => p.key === xAxis);
  const yParam = parameters.find(p => p.key === yAxis);
  const colorParam = parameters.find(p => p.key === colorBy);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <ScatterIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Scatter Data</h3>
          <p className="text-gray-500">Ask about parameter relationships to see correlations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScatterIcon className="w-4 h-4" />
          <h3 className="font-semibold text-foreground">Parameter Correlation</h3>
          <Badge variant="outline">{processedData.length} points</Badge>
        </div>
      </div>

      {/* Parameter Selection */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">X-Axis</label>
          <div className="flex gap-1 flex-wrap">
            {parameters.map(param => (
              <Button
                key={param.key}
                size="sm"
                variant={xAxis === param.key ? 'default' : 'outline'}
                onClick={() => setXAxis(param.key as any)}
                className="flex items-center gap-1 text-xs"
              >
                {param.icon}
                {param.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Y-Axis</label>
          <div className="flex gap-1 flex-wrap">
            {parameters.map(param => (
              <Button
                key={param.key}
                size="sm"
                variant={yAxis === param.key ? 'default' : 'outline'}
                onClick={() => setYAxis(param.key as any)}
                className="flex items-center gap-1 text-xs"
              >
                {param.icon}
                {param.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Color By</label>
          <div className="flex gap-1 flex-wrap">
            {parameters.slice(0, 3).map(param => (
              <Button
                key={param.key}
                size="sm"
                variant={colorBy === param.key ? 'default' : 'outline'}
                onClick={() => setColorBy(param.key as any)}
                className="flex items-center gap-1 text-xs"
              >
                {param.icon}
                {param.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Scatter Plot Visualization */}
      <div className="flex-1 bg-background rounded-lg border p-4">
        <div className="w-full h-full relative">
          <svg width="100%" height="100%" viewBox="0 0 600 400" className="border rounded">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="60" y1="340" x2="540" y2="340" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
            <line x1="60" y1="340" x2="60" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
            
            {/* Data points */}
            {processedData.slice(0, 100).map((point, index) => {
              const x = 60 + ((point.x - Math.min(...processedData.map(d => d.x))) / 
                (Math.max(...processedData.map(d => d.x)) - Math.min(...processedData.map(d => d.x)))) * 480;
              const y = 340 - ((point.y - Math.min(...processedData.map(d => d.y))) / 
                (Math.max(...processedData.map(d => d.y)) - Math.min(...processedData.map(d => d.y)))) * 280;
              
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={getColor(point.z, minColor, maxColor)}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.8"
                >
                  <title>{`${xParam?.name}: ${point.x?.toFixed(2)}, ${yParam?.name}: ${point.y?.toFixed(2)}, ${colorParam?.name}: ${point.z?.toFixed(2)}`}</title>
                </circle>
              );
            })}
            
            {/* Axis labels */}
            <text x="300" y="380" textAnchor="middle" className="text-sm fill-current opacity-70">
              {xParam?.name} ({xParam?.unit})
            </text>
            <text x="30" y="200" textAnchor="middle" className="text-sm fill-current opacity-70" transform="rotate(-90 30 200)">
              {yParam?.name} ({yParam?.unit})
            </text>
          </svg>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Color Scale: {colorParam?.name} ({colorParam?.unit})
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{minColor.toFixed(1)}</span>
            <div className="w-32 h-4 bg-gradient-to-r from-blue-600 to-red-600 rounded"></div>
            <span className="text-xs text-muted-foreground">{maxColor.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Correlation</div>
          <div className="font-semibold">
            {(() => {
              const xValues = processedData.map(d => d.x);
              const yValues = processedData.map(d => d.y);
              const n = xValues.length;
              if (n < 2) return 'N/A';
              
              const sumX = xValues.reduce((a, b) => a + b, 0);
              const sumY = yValues.reduce((a, b) => a + b, 0);
              const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
              const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
              const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);
              
              const correlation = (n * sumXY - sumX * sumY) / 
                Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
              
              return isNaN(correlation) ? 'N/A' : correlation.toFixed(3);
            })()
            }
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">{xParam?.name} Range</div>
          <div className="font-semibold">
            {processedData.length > 0 ? `${Math.min(...processedData.map(d => d.x)).toFixed(1)} - ${Math.max(...processedData.map(d => d.x)).toFixed(1)}` : 'N/A'}
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">{yParam?.name} Range</div>
          <div className="font-semibold">
            {processedData.length > 0 ? `${Math.min(...processedData.map(d => d.y)).toFixed(1)} - ${Math.max(...processedData.map(d => d.y)).toFixed(1)}` : 'N/A'}
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Data Points</div>
          <div className="font-semibold">{processedData.length}</div>
        </Card>
      </div>
    </div>
  );
}
