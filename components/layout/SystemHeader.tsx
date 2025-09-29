"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Mic, MicOff, Settings, CircleHelp as HelpCircle, Activity, Waves, Download, Share } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';
import { systemAPI } from '@/lib/api';
import { SystemHealth } from '@/types';

interface SystemHeaderProps {
  onToggleExplainableAI: () => void;
  onToggleVoice: () => void;
  showExplainableAI: boolean;
  isVoiceMode: boolean;
}

export function SystemHeader({ 
  onToggleExplainableAI, 
  onToggleVoice, 
  showExplainableAI, 
  isVoiceMode 
}: SystemHeaderProps) {
  const { actualTheme } = useTheme();
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchSystemHealth();
    const healthInterval = setInterval(fetchSystemHealth, 30000); // Every 30 seconds
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      clearInterval(healthInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const fetchSystemHealth = async () => {
    try {
      const health = await systemAPI.getHealth();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'degraded': return 'bg-white border border-gray-300';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg ocean-gradient shadow-md">
              <Waves className="w-6 h-6 text-white wave-animation" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">FloatChat</h1>
              <p className="text-xs text-gray-600">AI Ocean Data Discovery • {actualTheme} mode • Theme Working!</p>
            </div>
          </div>
          
          {/* System Status */}
          {systemHealth && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${getHealthStatusColor(systemHealth.status)}`} />
              <span className="text-sm text-gray-700">
                {systemHealth.metrics.active_users} users active
              </span>
            </div>
          )}
        </div>

        {/* Current Time and Data Status */}
        <div className="hidden md:flex items-center space-x-4 text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>UTC {currentTime.toISOString().slice(0, 19).replace('T', ' ')}</span>
          </div>
          {systemHealth && (
            <Badge variant="outline" className="text-xs">
              Data: {systemHealth.metrics.data_freshness.toLocaleString()}
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Voice Toggle */}
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleVoice}
            className={isVoiceMode ? "bg-red-600 hover:bg-red-700 text-white" : ""}
          >
            {isVoiceMode ? (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Voice On
              </>
            ) : (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Voice Off
              </>
            )}
          </Button>

          {/* Explainable AI Toggle */}
          <Button
            variant={showExplainableAI ? "default" : "outline"}
            size="sm"
            onClick={onToggleExplainableAI}
          >
            <Brain className="w-4 h-4 mr-2" />
            Explainable AI
          </Button>

          {/* Export Options */}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          {/* Share */}
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings */}
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Help */}
          <Button variant="outline" size="sm">
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      {systemHealth && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-6">
            <span>Queries/hour: {systemHealth.metrics.queries_per_hour}</span>
            <span>Avg response: {systemHealth.metrics.avg_response_time}ms</span>
            <span>Database: {systemHealth.services.database ? '✓' : '✗'}</span>
            <span>Vector DB: {systemHealth.services.vector_db ? '✓' : '✗'}</span>
            <span>LLM Service: {systemHealth.services.llm_service ? '✓' : '✗'}</span>
          </div>
          <div className="text-muted-foreground/70">
            Ocean insights powered by ARGO float data
          </div>
        </div>
      )}
    </header>
  );
}