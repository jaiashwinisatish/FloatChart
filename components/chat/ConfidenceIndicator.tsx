"use client";

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number;
  showDetails?: boolean;
}

export function ConfidenceIndicator({ score, showDetails = true }: ConfidenceIndicatorProps) {
  const getConfidenceLevel = (score: number) => {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-emerald-600';
      case 'medium': return 'text-foreground';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level) {
      case 'high': return <CheckCircle className="w-3 h-3" />;
      case 'medium': return <Brain className="w-3 h-3" />;
      case 'low': return <AlertTriangle className="w-3 h-3" />;
      default: return <Brain className="w-3 h-3" />;
    }
  };

  const getConfidenceMessage = (level: string) => {
    switch (level) {
      case 'high': return 'High confidence - Strong data support';
      case 'medium': return 'Medium confidence - Adequate data support';
      case 'low': return 'Low confidence - Limited data or uncertain interpretation';
      default: return 'Processing confidence score...';
    }
  };

  const level = getConfidenceLevel(score);
  const percentage = Math.round(score * 100);

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 ${getConfidenceColor(level)}`}>
        {getConfidenceIcon(level)}
        <Badge 
          variant="outline" 
          className={`text-xs confidence-${level} border-current`}
        >
          {percentage}% confident
        </Badge>
      </div>
      
      {showDetails && (
        <div className="flex-1 ml-2">
          <Progress 
            value={percentage} 
            className="w-full h-1"
          />
          <div className={`text-xs mt-1 ${getConfidenceColor(level)}`}>
            {getConfidenceMessage(level)}
          </div>
        </div>
      )}
    </div>
  );
}