"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, 
  Calendar, 
  Filter, 
  Clock,
  Bookmark,
  TrendingUp
} from 'lucide-react';
import { ChatMessage, QueryContext } from '@/types';

interface ContextPanelProps {
  messages: ChatMessage[];
  onUpdateContext: (context: QueryContext) => void;
}

export function ContextPanel({ messages, onUpdateContext }: ContextPanelProps) {
  const [currentContext, setCurrentContext] = useState<QueryContext>({
    preferred_parameters: ['temperature', 'salinity'],
    recent_floats: [],
    active_filters: {}
  });

  useEffect(() => {
    // Extract context from recent messages
    const recentQueries = messages
      .filter(m => m.role === 'user')
      .slice(-5);
    
    const extractedContext = extractContextFromMessages(recentQueries);
    setCurrentContext(prev => ({
      ...prev,
      ...extractedContext
    }));
  }, [messages]);

  const extractContextFromMessages = (messages: ChatMessage[]) => {
    const context: Partial<QueryContext> = {
      preferred_parameters: [],
      recent_floats: [],
      active_filters: {}
    };

    // Extract parameters mentioned in queries
    const parameterKeywords = {
      temperature: ['temperature', 'temp', 'thermal'],
      salinity: ['salinity', 'salt', 'psu'],
      pressure: ['pressure', 'depth'],
      oxygen: ['oxygen', 'o2', 'dissolved oxygen'],
      chlorophyll: ['chlorophyll', 'chl', 'phyto'],
      nitrate: ['nitrate', 'no3', 'nutrients']
    };

    messages.forEach(message => {
      const content = message.content.toLowerCase();
      Object.entries(parameterKeywords).forEach(([param, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          if (!context.preferred_parameters?.includes(param)) {
            context.preferred_parameters?.push(param);
          }
        }
      });

      // Extract float IDs
      const floatMatches = content.match(/\b\d{7}\b/g);
      if (floatMatches) {
        context.recent_floats?.push(...floatMatches);
      }

      // Extract locations
      const locationKeywords = [
        'arabian sea', 'indian ocean', 'pacific', 'atlantic',
        'equator', 'tropical', 'subtropical'
      ];
      locationKeywords.forEach(location => {
        if (content.includes(location)) {
          context.active_filters = {
            ...context.active_filters,
            location: location
          };
        }
      });
    });

    return context;
  };

  const clearContext = () => {
    const clearedContext: QueryContext = {
      preferred_parameters: [],
      recent_floats: [],
      active_filters: {}
    };
    setCurrentContext(clearedContext);
    onUpdateContext(clearedContext);
  };

  return (
    <div className="h-full bg-background flex flex-col">
      <div className="border-b bg-card border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Query Context</h3>
          <Button variant="outline" size="sm" onClick={clearContext}>
            Clear
          </Button>
        </div>
        <p className="text-sm text-gray-700 mt-1">
          Active filters and preferences from your conversation
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Recent Query Summary */}
          <Card className="p-3 bg-card border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium text-sm text-foreground">Recent Activity</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {messages.filter(m => m.role === 'user').length} queries in this session
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Last query: {messages.filter(m => m.role === 'user').slice(-1)[0]?.timestamp.toLocaleTimeString()}
            </div>
          </Card>

          {/* Preferred Parameters */}
          {currentContext.preferred_parameters && currentContext.preferred_parameters.length > 0 && (
            <Card className="p-3 bg-card border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Preferred Parameters</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentContext.preferred_parameters.map(param => (
                  <Badge key={param} variant="secondary" className="text-xs">
                    {param}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Spatial Context */}
          {currentContext.spatial_focus && (
            <Card className="p-3 bg-card border-border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Location Focus</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Lat: {currentContext.spatial_focus.latitude?.toFixed(2)}°<br />
                Lng: {currentContext.spatial_focus.longitude?.toFixed(2)}°
              </div>
            </Card>
          )}

          {/* Temporal Context */}
          {currentContext.temporal_focus && (
            <Card className="p-3 bg-card border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Time Range</span>
              </div>
              <div className="text-xs text-muted-foreground">
                From: {currentContext.temporal_focus.start.toLocaleDateString()}<br />
                To: {currentContext.temporal_focus.end.toLocaleDateString()}
              </div>
            </Card>
          )}

          {/* Recent Floats */}
          {currentContext.recent_floats && currentContext.recent_floats.length > 0 && (
            <Card className="p-3 bg-card border-border">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Recent Floats</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {[...new Set(currentContext.recent_floats)].slice(0, 5).map(floatId => (
                  <Badge key={floatId} variant="outline" className="text-xs">
                    {floatId}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Active Filters */}
          {Object.keys(currentContext.active_filters || {}).length > 0 && (
            <Card className="p-3 bg-card border-border">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-sm text-foreground">Active Filters</span>
              </div>
              <div className="space-y-1">
                {Object.entries(currentContext.active_filters || {}).map(([key, value]) => (
                  <div key={key} className="text-xs text-muted-foreground">
                    <span className="font-medium capitalize text-foreground">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Conversation Tips */}
          <Card className="p-3 bg-card border-border">
            <div className="text-sm font-medium text-primary mb-2">
              💡 Context Tips
            </div>
            <div className="text-xs text-primary/80 space-y-1">
              <div>• Your preferences are remembered throughout the conversation</div>
              <div>• Use "narrow to..." or "also include..." to refine results</div>
              <div>• Click map locations to add spatial context</div>
              <div>• Previous queries help provide better suggestions</div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}