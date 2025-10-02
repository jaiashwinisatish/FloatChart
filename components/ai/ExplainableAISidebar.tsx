"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Database, FileText, Code, ChartBar as BarChart3, X, ChevronDown, ChevronRight, Copy, Download } from 'lucide-react';
import { QueryMetadata, VisualizationSpec, RetrievedDocument } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExplainableAISidebarProps {
  queryMetadata: QueryMetadata | null;
  visualization: VisualizationSpec | null;
  onClose: () => void;
}

export function ExplainableAISidebar({ queryMetadata, visualization, onClose }: ExplainableAISidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatSqlQuery = (sql: string) => {
    // Basic SQL formatting
    return sql
      .replace(/\bSELECT\b/gi, 'SELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b/gi, '\n  AND')
      .replace(/\bORDER BY\b/gi, '\nORDER BY');
  };

  const copyToClipboard = async (text: string) => {
    try {
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="h-full bg-background border-l border-border flex flex-col">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Explainable AI</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Understanding how AI generated this response
        </p>
      </div>

      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 space-y-4">
          {/* Overview */}
          <Collapsible 
            open={expandedSections.has('overview')} 
            onOpenChange={() => toggleSection('overview')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="flex items-center gap-2">
                  {expandedSections.has('overview') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">Query Overview</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="p-3 bg-slate-800 border-slate-600">
                {queryMetadata ? (
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Original Query:</span>
                      <p className="text-muted-foreground mt-1 italic">"{queryMetadata.original_query}"</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Processed Query:</span>
                      <p className="text-muted-foreground mt-1">"{queryMetadata.processed_query}"</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {queryMetadata.execution_time}ms
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {queryMetadata.data_points_returned} results
                      </Badge>
                      {queryMetadata.spatial_bounds && (
                        <Badge variant="outline" className="text-xs">
                          Geospatial
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    No query metadata available
                  </div>
                )}
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Retrieved Documents */}
          <Collapsible 
            open={expandedSections.has('documents')} 
            onOpenChange={() => toggleSection('documents')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="flex items-center gap-2">
                  {expandedSections.has('documents') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <Database className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-white">Retrieved Documents</span>
                  {queryMetadata?.retrieved_documents && (
                    <Badge variant="secondary" className="text-xs">
                      {queryMetadata.retrieved_documents.length}
                    </Badge>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2">
                {queryMetadata?.retrieved_documents?.map((doc, index) => (
                  <Card key={doc.id} className="p-3 bg-slate-800 border-slate-600">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Score: {(doc.similarity_score * 100).toFixed(1)}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {doc.source}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(doc.content)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3">
                      {doc.content}
                    </p>
                    {Object.keys(doc.metadata).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-600">
                        <div className="text-xs text-slate-400">
                          <strong className="text-white">Metadata:</strong> {JSON.stringify(doc.metadata, null, 2)}
                        </div>
                      </div>
                    )}
                  </Card>
                )) || (
                  <div className="text-sm text-slate-400 p-3 bg-slate-800 rounded-lg border border-slate-700">
                    No retrieved documents available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* SQL Query */}
          <Collapsible 
            open={expandedSections.has('sql')} 
            onOpenChange={() => toggleSection('sql')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="flex items-center gap-2">
                  {expandedSections.has('sql') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <Code className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-white">Generated SQL</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="p-3 bg-slate-800 border-slate-600">
                {queryMetadata?.sql_query ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-300">SQL Query</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(queryMetadata.sql_query)}
                        className="h-6 px-2"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="text-xs bg-slate-900 text-slate-300 p-2 rounded border border-slate-700 font-mono overflow-x-auto">
                      {formatSqlQuery(queryMetadata.sql_query)}
                    </pre>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    No SQL query available
                  </div>
                )}
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Visualization Spec */}
          <Collapsible 
            open={expandedSections.has('visualization')} 
            onOpenChange={() => toggleSection('visualization')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                <div className="flex items-center gap-2">
                  {expandedSections.has('visualization') ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <BarChart3 className="w-4 h-4 text-slate-300" />
                  <span className="font-medium text-white">Visualization Config</span>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <Card className="p-3 bg-slate-800 border-slate-600">
                {visualization ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Type: {visualization.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {visualization.data.length} points
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium text-white">Configuration:</div>
                      <ul className="mt-1 text-xs text-slate-300 space-y-1">
                        <li>• Title: {visualization.config.title}</li>
                        <li>• X-axis: {visualization.config.x_axis}</li>
                        <li>• Y-axis: {visualization.config.y_axis}</li>
                        {visualization.config.color_by && (
                          <li>• Color by: {visualization.config.color_by}</li>
                        )}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-slate-600">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(visualization, null, 2))}
                        className="text-xs h-7"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Spec
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">
                    No visualization specification available
                  </div>
                )}
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Context Used */}
          {queryMetadata?.context_used && (
            <Collapsible 
              open={expandedSections.has('context')} 
              onOpenChange={() => toggleSection('context')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                  <div className="flex items-center gap-2">
                    {expandedSections.has('context') ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <Brain className="w-4 h-4 text-slate-300" />
                    <span className="font-medium text-white">Context Used</span>
                    <Badge variant="secondary" className="text-xs">
                      {queryMetadata.context_used.length}
                    </Badge>
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Card className="p-3 bg-slate-800 border-slate-600">
                  <div className="space-y-1">
                    {queryMetadata.context_used.map((context, index) => (
                      <div key={index} className="text-xs bg-slate-900 text-slate-300 p-2 rounded border border-slate-700">
                        {context}
                      </div>
                    ))}
                  </div>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-slate-800 border-slate-700 p-4">
        <Button variant="outline" size="sm" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis
        </Button>
      </div>
    </div>
  );
}