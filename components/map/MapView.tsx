"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Layers, 
  Crosshair, 
  Search,
  Filter,
  Download,
  Maximize2
} from 'lucide-react';
import { VisualizationSpec } from '@/types';

interface MapViewProps {
  onLocationQuery: (coordinates: [number, number], query: string) => void;
  visualizationData?: VisualizationSpec | null;
}

export function MapView({ onLocationQuery, visualizationData }: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [queryText, setQueryText] = useState('');
  const [mapStyle, setMapStyle] = useState<'osm' | 'satellite' | 'ocean'>('ocean');
  const [showFloats, setShowFloats] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  // Sample ARGO float data - in production, this would come from the API
  const sampleFloats = [
    { id: '2903334', lat: 15.5, lng: 68.2, status: 'active', lastProfile: '2023-11-15' },
    { id: '2903335', lat: 10.2, lng: 65.8, status: 'active', lastProfile: '2023-11-14' },
    { id: '2903336', lat: 8.7, lng: 72.1, status: 'inactive', lastProfile: '2023-10-20' },
    { id: '2903337', lat: 12.3, lng: 70.5, status: 'active', lastProfile: '2023-11-15' },
  ];

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
  };

  const handleLocationQuery = () => {
    if (selectedLocation && queryText.trim()) {
      onLocationQuery(selectedLocation, queryText);
      setQueryText('');
    }
  };

  const handleExport = () => {
    const mapData = {
      selectedLocation,
      floats: sampleFloats,
      mapStyle,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(mapData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `floatchat-map-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterToggle = () => {
    // Toggle filter panel or show filter options
    alert('Filter options: Distance from location, Float status, Date range, Parameter thresholds');
  };

  const getMapStyleUrl = (style: string) => {
    switch (style) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'ocean':
        return 'https://services.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Mock map implementation - in production, use Leaflet or Mapbox
  const MapImplementation = () => (
    <div className="relative w-full h-full bg-blue-100 rounded-lg overflow-hidden">
      {/* Map placeholder with ocean-like gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute h-px bg-white" style={{ top: `${i * 10}%`, width: '100%' }} />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute w-px bg-white" style={{ left: `${i * 10}%`, height: '100%' }} />
          ))}
        </div>

        {/* ARGO Float markers */}
        {showFloats && sampleFloats.map((float) => {
          const x = ((float.lng + 180) / 360) * 100;
          const y = ((90 - float.lat) / 180) * 100;
          return (
            <div
              key={float.id}
              className={`absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                float.status === 'active' ? 'bg-green-400 shadow-lg' : 'bg-red-400'
              } hover:scale-150 transition-transform`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => handleMapClick(float.lat, float.lng)}
              title={`Float ${float.id} - ${float.status}`}
            />
          );
        })}

        {/* Selected location marker */}
        {selectedLocation && (
          <div
            className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: `${((selectedLocation[1] + 180) / 360) * 100}%`,
              top: `${((90 - selectedLocation[0]) / 180) * 100}%`
            }}
          />
        )}

        {/* Map labels */}
        <div className="absolute top-4 left-4 text-foreground text-xs font-mono opacity-75">
          Arabian Sea
        </div>
        <div className="absolute top-1/2 right-8 text-foreground text-xs font-mono opacity-75">
          Indian Ocean
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-foreground text-xs font-mono opacity-75">
          Equator
        </div>
      </div>

      {/* Coordinate display */}
      {selectedLocation && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="text-xs font-mono">
            Lat: {selectedLocation[0].toFixed(2)}°<br />
            Lng: {selectedLocation[1].toFixed(2)}°
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Map Controls */}
      <div className="border-b bg-white border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-black">Map Style:</span>
              <div className="flex gap-1">
                {(['osm', 'satellite', 'ocean'] as const).map((style) => (
                  <Button
                    key={style}
                    size="sm"
                    variant={mapStyle === style ? 'default' : 'outline'}
                    onClick={() => setMapStyle(style)}
                    className="text-xs"
                  >
                    {style === 'osm' ? 'Street' : style === 'satellite' ? 'Satellite' : 'Ocean'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-floats"
                checked={showFloats}
                onChange={(e) => setShowFloats(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="show-floats" className="text-sm text-foreground">Show ARGO Floats</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleFilterToggle}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={() => alert('Fullscreen mode activated!')}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Location Query Interface */}
        {selectedLocation && (
          <Card className="p-3 bg-white border-gray-200">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <div className="text-sm font-medium text-foreground">
                Location Selected: {selectedLocation[0].toFixed(2)}°, {selectedLocation[1].toFixed(2)}°
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Ask about this location... e.g., 'show salinity here in March 2023'"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                className="flex-1 bg-white border-gray-300 text-black placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleLocationQuery()}
              />
              <Button 
                onClick={handleLocationQuery}
                disabled={!queryText.trim()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapImplementation />

        {/* Float Status Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <div className="text-sm font-medium mb-2 text-black">ARGO Floats</div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Active ({sampleFloats.filter(f => f.status === 'active').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Inactive ({sampleFloats.filter(f => f.status === 'inactive').length})</span>
            </div>
          </div>
        </div>

        {/* Scale Bar */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <div className="text-xs font-mono text-black">Scale: ~500km</div>
        </div>

        {/* Click instruction */}
        {!selectedLocation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-lg border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <Crosshair className="w-5 h-5" />
                <span>Click on the map to select a location and ask questions</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}