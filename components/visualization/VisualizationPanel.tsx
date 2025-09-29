"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChartBar as BarChart3, ChartLine as LineChart, ChartScatter as ScatterChart, Map, Download, Share, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { VisualizationSpec, ChatMessage } from '@/types';
import { ProfilePlot } from './ProfilePlot';
import { TimeSeriesPlot } from './TimeSeriesPlot';
import { ScatterPlot } from './ScatterPlot';
import { HeatmapPlot } from './HeatmapPlot';

interface VisualizationPanelProps {
  specification: VisualizationSpec | null;
  data: ChatMessage[];
}

export function VisualizationPanel({ specification, data }: VisualizationPanelProps) {
  const [activeVisualization, setActiveVisualization] = useState<string>('profile');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [plotData, setPlotData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample data based on the current visualization type
    generateSampleData();
  }, [activeVisualization]);

  const generateSampleData = () => {
    switch (activeVisualization) {
      case 'profile':
        setPlotData(generateProfileData());
        break;
      case 'timeseries':
        setPlotData(generateTimeSeriesData());
        break;
      case 'scatter':
        setPlotData(generateScatterData());
        break;
      case 'heatmap':
        setPlotData(generateHeatmapData());
        break;
      default:
        setPlotData([]);
    }
  };

  const generateProfileData = () => {
    const profiles = [];
    for (let i = 0; i < 3; i++) {
      const profile = [];
      for (let depth = 0; depth <= 2000; depth += 50) {
        profile.push({
          depth: depth,
          temperature: 28 - (depth / 100) * (2 + Math.random() * 0.5),
          salinity: 34.5 + (depth / 500) * (0.5 + Math.random() * 0.2),
          pressure: depth * 1.025 + Math.random() * 2,
          float_id: `290333${4 + i}`
        });
      }
      profiles.push(...profile);
    }
    return profiles;
  };

  const generateTimeSeriesData = () => {
    const data = [];
    const startDate = new Date('2023-01-01');
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        temperature: 25 + Math.sin(i / 30) * 3 + Math.random() * 2,
        salinity: 34.8 + Math.cos(i / 60) * 0.3 + Math.random() * 0.1,
        float_count: Math.floor(15 + Math.sin(i / 90) * 5 + Math.random() * 3)
      });
    }
    return data;
  };

  const generateScatterData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
      data.push({
        temperature: 15 + Math.random() * 15,
        salinity: 34 + Math.random() * 2,
        depth: Math.random() * 2000,
        oxygen: 150 + Math.random() * 100,
        float_id: `290333${4 + Math.floor(i / 50)}`
      });
    }
    return data;
  };

  const generateHeatmapData = () => {
    const data = [];
    const latitudes = Array.from({length: 20}, (_, i) => -10 + i);
    const longitudes = Array.from({length: 20}, (_, i) => 60 + i);
    
    for (const lat of latitudes) {
      for (const lng of longitudes) {
        data.push({
          latitude: lat,
          longitude: lng,
          temperature: 28 - Math.abs(lat) * 0.5 + Math.random() * 2,
          salinity: 34.5 + Math.random() * 0.5
        });
      }
    }
    return data;
  };

  const renderVisualization = () => {
    if (!plotData.length) {
      return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No visualization data available</p>
            <p className="text-sm mt-2">Ask a question to generate plots and charts</p>
          </div>
        </div>
      );
    }

    switch (activeVisualization) {
      case 'profile':
        return <ProfilePlot data={plotData} />;
      case 'timeseries':
        return <TimeSeriesPlot data={plotData} />;
      case 'scatter':
        return <ScatterPlot data={plotData} />;
      case 'heatmap':
        return <HeatmapPlot data={plotData} />;
      default:
        return <ProfilePlot data={plotData} />;
    }
  };

  return (
    <div className={`h-full flex flex-col bg-white ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="border-b bg-white border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-foreground">Ocean Data Visualizations</h3>
            <Badge variant="outline" className="text-xs">
              {plotData.length} data points
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Visualization Types */}
        <Tabs value={activeVisualization} onValueChange={setActiveVisualization} className="mt-4">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <LineChart className="w-4 h-4" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="timeseries" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Time Series
            </TabsTrigger>
            <TabsTrigger value="scatter" className="flex items-center gap-2">
              <ScatterChart className="w-4 h-4" />
              Scatter
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Heatmap
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Visualization Content */}
      <div className="flex-1 p-4">
        <Card className="h-full p-4 depth-shadow">
          {renderVisualization()}
        </Card>
      </div>
    </div>
  );
}