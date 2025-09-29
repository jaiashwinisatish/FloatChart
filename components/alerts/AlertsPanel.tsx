"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TriangleAlert as AlertTriangle, Bell, TrendingUp, TrendingDown, MapPin, Clock, X, Settings, Filter } from 'lucide-react';
import { OceanAnomalies } from '@/types';

export function AlertsPanel() {
  const [alerts, setAlerts] = useState<OceanAnomalies[]>([]);
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    // Mock alerts - in production, fetch from API
    const mockAlerts: OceanAnomalies[] = [
      {
        id: '1',
        type: 'temperature',
        severity: 'critical',
        location: { latitude: 15.2, longitude: 68.5, region: 'Arabian Sea' },
        detected_at: new Date('2023-11-15T14:30:00Z'),
        description: 'Abnormal temperature spike detected - 3.2°C above seasonal average',
        affected_floats: ['2903334', '2903335'],
        confidence: 0.95,
        auto_generated: true
      },
      {
        id: '2',
        type: 'salinity',
        severity: 'high',
        location: { latitude: 10.8, longitude: 72.1, region: 'Indian Ocean' },
        detected_at: new Date('2023-11-15T12:15:00Z'),
        description: 'Unusual salinity gradient observed - possible freshwater intrusion',
        affected_floats: ['2903336'],
        confidence: 0.87,
        auto_generated: true
      },
      {
        id: '3',
        type: 'current',
        severity: 'medium',
        location: { latitude: 8.5, longitude: 65.2, region: 'Arabian Sea' },
        detected_at: new Date('2023-11-15T10:45:00Z'),
        description: 'Float trajectory indicates unexpected current pattern',
        affected_floats: ['2903337'],
        confidence: 0.73,
        auto_generated: true
      },
      {
        id: '4',
        type: 'oxygen',
        severity: 'high',
        location: { latitude: 12.7, longitude: 69.8, region: 'Arabian Sea' },
        detected_at: new Date('2023-11-14T18:20:00Z'),
        description: 'Low oxygen levels detected at 200-500m depth range',
        affected_floats: ['2903334', '2903337'],
        confidence: 0.91,
        auto_generated: false
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-white text-foreground border-border';
      case 'medium': return 'bg-white text-foreground border-border';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-foreground" />;
      case 'medium': return <TrendingDown className="w-4 h-4 text-foreground" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'temperature': return <span className={`${iconClass} text-red-500`}>🌡️</span>;
      case 'salinity': return <span className={`${iconClass} text-blue-500`}>🧂</span>;
      case 'oxygen': return <span className={`${iconClass} text-green-500`}>💨</span>;
      case 'current': return <span className={`${iconClass} text-purple-500`}>🌊</span>;
      default: return <Bell className={iconClass} />;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b bg-white border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Ocean Alerts</h3>
            <Badge variant="secondary" className="text-xs">
              {filteredAlerts.length} active
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(severity => (
            <Button
              key={severity}
              variant={filter === severity ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(severity)}
              className="text-xs"
            >
              {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
              {severity !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {alerts.filter(a => a.severity === severity).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="p-6 text-center bg-card border-border">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-lg font-medium text-muted-foreground mb-2">No Alerts</h4>
              <p className="text-sm text-muted-foreground">
                {filter === 'all' ? 'All systems are running normally.' : `No ${filter} severity alerts.`}
              </p>
            </Card>
          ) : (
            filteredAlerts.map(alert => (
              <Card key={alert.id} className={`p-4 bg-card border-border ${getSeverityColor(alert.severity)} border-l-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(alert.severity)}
                    <Badge variant="outline" className="text-xs capitalize">
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getTypeIcon(alert.type)} {alert.type}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">{alert.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.location.region} ({alert.location.latitude.toFixed(1)}°, {alert.location.longitude.toFixed(1)}°)
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(alert.detected_at)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {alert.affected_floats.map(floatId => (
                        <Badge key={floatId} variant="secondary" className="text-xs">
                          Float {floatId}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(alert.confidence * 100)}% confidence
                      </Badge>
                      {alert.auto_generated && (
                        <Badge variant="outline" className="text-xs">
                          🤖 Auto
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-card border-border p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <Button variant="ghost" size="sm" className="text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Advanced Filters
          </Button>
        </div>
      </div>
    </div>
  );
}