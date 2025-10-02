"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Map, Thermometer, Droplets, Palette } from 'lucide-react';

interface HeatmapPlotProps {
  data: any[];
}

export function HeatmapPlot({ data }: HeatmapPlotProps) {
  const [selectedParameter, setSelectedParameter] = useState<'temperature' | 'salinity'>('temperature');
  const [colorScheme, setColorScheme] = useState<'thermal' | 'ocean' | 'viridis'>('thermal');
  
  // Process data into a grid
  const processDataToGrid = () => {
    if (!data || data.length === 0) return { grid: [], latRange: [0, 0], lonRange: [0, 0] };
    
    const lats = [...new Set(data.map(d => d.latitude))].sort((a, b) => b - a); // Descending for proper display
    const lons = [...new Set(data.map(d => d.longitude))].sort((a, b) => a - b);
    
    const grid = lats.map(lat => 
      lons.map(lon => {
        const point = data.find(d => d.latitude === lat && d.longitude === lon);
        return point ? point[selectedParameter] : null;
      })
    );
    
    return {
      grid,
      latRange: [Math.min(...lats), Math.max(...lats)],
      lonRange: [Math.min(...lons), Math.max(...lons)],
      lats,
      lons
    };
  };

  const { grid, latRange, lonRange, lats, lons } = processDataToGrid();
  
  // Get color schemes - avoiding yellow colors
  const getColorSchemes = () => {
    return {
      thermal: {
        name: 'Thermal',
        colors: ['#1e3a8a', '#3b82f6', '#06b6d4', '#10b981', '#f97316', '#dc2626'], // Blue to red, no yellow
        description: 'Blue to Red'
      },
      ocean: {
        name: 'Ocean',
        colors: ['#0c4a6e', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'], // Ocean blues
        description: 'Deep to Light Blue'
      },
      viridis: {
        name: 'Viridis',
        colors: ['#581c87', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'], // Purple gradient
        description: 'Purple Gradient'
      }
    };
  };

  const colorSchemes = getColorSchemes();
  const currentScheme = colorSchemes[colorScheme];
  
  // Get color for value
  const getColor = (value: number, min: number, max: number) => {
    if (value == null) return 'hsl(var(--muted) / 0.3)'; // Theme-aware gray for null values
    
    const ratio = (value - min) / (max - min);
    const colorIndex = Math.min(Math.floor(ratio * currentScheme.colors.length), currentScheme.colors.length - 1);
    
    return currentScheme.colors[colorIndex];
  };

  // Calculate min/max values
  const values = data.map(d => d[selectedParameter]).filter(v => v != null);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 1;
  
  const parameterConfig = {
    temperature: { name: 'Temperature', unit: '°C', icon: <Thermometer className="w-4 h-4" /> },
    salinity: { name: 'Salinity', unit: 'PSU', icon: <Droplets className="w-4 h-4" /> }
  };

  const config = parameterConfig[selectedParameter];

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Heatmap Data</h3>
          <p className="text-gray-500">Ask about spatial distributions to see geographic patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4" />
          <h3 className="font-semibold text-foreground">{config.name} Heatmap</h3>
          <Badge variant="outline">{data.length} grid points</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedParameter === 'temperature' ? 'default' : 'outline'}
            onClick={() => setSelectedParameter('temperature')}
            className="flex items-center gap-1"
          >
            <Thermometer className="w-3 h-3" />
            Temperature
          </Button>
          <Button
            size="sm"
            variant={selectedParameter === 'salinity' ? 'default' : 'outline'}
            onClick={() => setSelectedParameter('salinity')}
            className="flex items-center gap-1"
          >
            <Droplets className="w-3 h-3" />
            Salinity
          </Button>
        </div>
      </div>

      {/* Color Scheme Selection */}
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Color Scheme:</span>
        {Object.entries(colorSchemes).map(([key, scheme]) => (
          <Button
            key={key}
            size="sm"
            variant={colorScheme === key ? 'default' : 'outline'}
            onClick={() => setColorScheme(key as any)}
            className="text-xs"
          >
            {scheme.name}
          </Button>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          {/* Grid */}
          <div 
            className="grid gap-0.5 border border-border rounded-lg overflow-hidden"
            style={{ 
              gridTemplateColumns: `repeat(${lons.length}, 1fr)`,
              width: 'min(600px, 80vw)',
              height: 'min(400px, 60vh)'
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square flex items-center justify-center text-xs font-mono cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                  style={{
                    backgroundColor: getColor(value, minValue, maxValue),
                    color: value != null && (value - minValue) / (maxValue - minValue) > 0.5 ? 'white' : 'black'
                  }}
                  title={`Lat: ${lats[rowIndex]?.toFixed(1)}°, Lon: ${lons[colIndex]?.toFixed(1)}°, ${config.name}: ${value?.toFixed(2) || 'N/A'} ${config.unit}`}
                >
                  {value?.toFixed(1) || '-'}
                </div>
              ))
            )}
          </div>
          
          {/* Axis Labels */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            <span>{lonRange[0].toFixed(1)}°E</span>
            <span>Longitude</span>
            <span>{lonRange[1].toFixed(1)}°E</span>
          </div>
          
          <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
            <span>{latRange[1].toFixed(1)}°N</span>
            <span className="transform -rotate-90 whitespace-nowrap">Latitude</span>
            <span>{latRange[0].toFixed(1)}°N</span>
          </div>
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="mt-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">
              {config.name} ({config.unit})
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{minValue.toFixed(1)}</span>
              <div 
                className="w-48 h-6 rounded flex"
                style={{
                  background: `linear-gradient(to right, ${currentScheme.colors.join(', ')})`
                }}
              ></div>
              <span className="text-xs text-muted-foreground">{maxValue.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Grid Size</div>
          <div className="font-semibold">{lats.length} × {lons.length}</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">{config.name} Range</div>
          <div className="font-semibold">
            {minValue.toFixed(2)} - {maxValue.toFixed(2)} {config.unit}
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Coverage</div>
          <div className="font-semibold">
            {((values.length / (lats.length * lons.length)) * 100).toFixed(1)}%
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Data Points</div>
          <div className="font-semibold">{data.length}</div>
        </Card>
      </div>
    </div>
  );
}
