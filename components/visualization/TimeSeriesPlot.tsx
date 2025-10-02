"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';

interface TimeSeriesPlotProps {
  data: any[];
}

export function TimeSeriesPlot({ data }: TimeSeriesPlotProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temperature', 'salinity']);
  
  // Process data for time series
  const processedData = data.map(point => ({
    ...point,
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const metrics = [
    { key: 'temperature', name: 'Temperature', color: '#dc2626', unit: '°C' }, // Red-600
    { key: 'salinity', name: 'Salinity', color: '#2563eb', unit: 'PSU' }, // Blue-600
    { key: 'float_count', name: 'Active Floats', color: '#059669', unit: 'count' } // Emerald-600
  ];

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg border">
          <div className="font-semibold text-sm mb-2">{label}</div>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey);
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span>{metric?.name}: {entry.value?.toFixed(2)} {metric?.unit}</span>
              </div>
            );
          })}
        </Card>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Time Series Data</h3>
          <p className="text-gray-500">Ask about temporal trends to see data over time</p>
        </div>
      </div>
    );
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <h3 className="font-semibold text-foreground">Time Series Analysis</h3>
          <Badge variant="outline">{data.length} data points</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chartType === 'line' ? 'default' : 'outline'}
            onClick={() => setChartType('line')}
            className="flex items-center gap-1"
          >
            <TrendingUp className="w-3 h-3" />
            Line
          </Button>
          <Button
            size="sm"
            variant={chartType === 'area' ? 'default' : 'outline'}
            onClick={() => setChartType('area')}
            className="flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3" />
            Area
          </Button>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="flex gap-2 mb-4">
        {metrics.map(metric => (
          <Button
            key={metric.key}
            size="sm"
            variant={selectedMetrics.includes(metric.key) ? 'default' : 'outline'}
            onClick={() => toggleMetric(metric.key)}
            className="flex items-center gap-1"
            style={{
              backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : undefined,
              borderColor: metric.color
            }}
          >
            <Activity className="w-3 h-3" />
            {metric.name}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis 
              dataKey="date"
              className="stroke-muted-foreground"
              tick={{ fontSize: 12 }}
            />
            <YAxis className="stroke-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {selectedMetrics.map(metricKey => {
              const metric = metrics.find(m => m.key === metricKey);
              if (!metric) return null;
              
              if (chartType === 'area') {
                return (
                  <Area
                    key={metricKey}
                    type="monotone"
                    dataKey={metricKey}
                    stroke={metric.color}
                    fill={metric.color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    name={metric.name}
                  />
                );
              } else {
                return (
                  <Line
                    key={metricKey}
                    type="monotone"
                    dataKey={metricKey}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ fill: metric.color, strokeWidth: 2, r: 3 }}
                    name={metric.name}
                  />
                );
              }
            })}
          </ChartComponent>
        </ResponsiveContainer>
      </div>

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <Card className="p-3">
          <div className="text-xs text-muted-foreground">Time Period</div>
          <div className="font-semibold">
            {data.length} days
          </div>
        </Card>
        {selectedMetrics.slice(0, 3).map(metricKey => {
          const metric = metrics.find(m => m.key === metricKey);
          if (!metric) return null;
          const values = data.map(d => d[metricKey]).filter(v => v != null);
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          
          return (
            <Card key={metricKey} className="p-3">
              <div className="text-xs text-muted-foreground">Avg {metric.name}</div>
              <div className="font-semibold">
                {avg.toFixed(2)} {metric.unit}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}