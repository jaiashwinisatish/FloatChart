"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Thermometer, Droplets, Gauge } from 'lucide-react';

interface ProfilePlotProps {
  data: any[];
}

export function ProfilePlot({ data }: ProfilePlotProps) {
  const [selectedParameter, setSelectedParameter] = useState<'temperature' | 'salinity' | 'pressure'>('temperature');
  
  // Process data for depth profiles
  const processedData = data.reduce((acc: any[], point) => {
    const existingDepth = acc.find(item => item.depth === point.depth);
    if (existingDepth) {
      existingDepth[`${selectedParameter}_${point.float_id}`] = point[selectedParameter];
    } else {
      acc.push({
        depth: point.depth,
        [`${selectedParameter}_${point.float_id}`]: point[selectedParameter]
      });
    }
    return acc;
  }, []).sort((a, b) => a.depth - b.depth);

  // Get unique float IDs for legend
  const floatIds = [...new Set(data.map(d => d.float_id))];
  
  const getParameterConfig = () => {
    switch (selectedParameter) {
      case 'temperature':
        return {
          color: '#dc2626', // Red-600 - works in both themes
          unit: '°C',
          icon: <Thermometer className="w-4 h-4" />,
          name: 'Temperature'
        };
      case 'salinity':
        return {
          color: '#2563eb', // Blue-600 - works in both themes
          unit: 'PSU',
          icon: <Droplets className="w-4 h-4" />,
          name: 'Salinity'
        };
      case 'pressure':
        return {
          color: '#7c3aed', // Violet-600 - works in both themes
          unit: 'dbar',
          icon: <Gauge className="w-4 h-4" />,
          name: 'Pressure'
        };
    }
  };

  const config = getParameterConfig();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border">
          <div className="font-semibold text-sm mb-2">Depth: {label}m</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}: {entry.value?.toFixed(2)} {config.unit}</span>
            </div>
          ))}
        </Card>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Thermometer className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Profile Data</h3>
          <p className="text-gray-500">Ask about ocean profiles to see depth-based measurements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {config.icon}
          <h3 className="font-semibold text-foreground">{config.name} Profiles</h3>
          <Badge variant="outline">{floatIds.length} floats</Badge>
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
          <Button
            size="sm"
            variant={selectedParameter === 'pressure' ? 'default' : 'outline'}
            onClick={() => setSelectedParameter('pressure')}
            className="flex items-center gap-1"
          >
            <Gauge className="w-3 h-3" />
            Pressure
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis 
              dataKey="depth"
              type="number"
              domain={['dataMin', 'dataMax']}
              label={{ value: 'Depth (m)', position: 'insideBottom', offset: -10 }}
              className="stroke-muted-foreground"
            />
            <YAxis 
              label={{ value: `${config.name} (${config.unit})`, angle: -90, position: 'insideLeft' }}
              className="stroke-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {floatIds.map((floatId, index) => (
              <Line
                key={floatId}
                type="monotone"
                dataKey={`${selectedParameter}_${floatId}`}
                stroke={`hsl(${(index * 120 + 200) % 360}, 65%, 45%)`}
                strokeWidth={2}
                dot={{ fill: `hsl(${(index * 120 + 200) % 360}, 65%, 45%)`, strokeWidth: 2, r: 3 }}
                name={`Float ${floatId}`}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Depth Range</div>
          <div className="font-semibold">
            {Math.min(...data.map(d => d.depth))}m - {Math.max(...data.map(d => d.depth))}m
          </div>
        </Card>
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">{config.name} Range</div>
          <div className="font-semibold">
            {Math.min(...data.map(d => d[selectedParameter])).toFixed(2)} - {Math.max(...data.map(d => d[selectedParameter])).toFixed(2)} {config.unit}
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