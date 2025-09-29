"use client";

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { MapView } from '@/components/map/MapView';
import { VisualizationPanel } from '@/components/visualization/VisualizationPanel';
import { SystemHeader } from '@/components/layout/SystemHeader';
import { ExplainableAISidebar } from '@/components/ai/ExplainableAISidebar';
import { VoiceInput } from '@/components/input/VoiceInput';
import { ContextPanel } from '@/components/context/ContextPanel';
import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Video as Sidebar, Map, MessageSquare, ChartBar as BarChart3, Users, Bell, Brain, Mic } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { ChatMessage, QueryMetadata, VisualizationSpec, UserSession } from '@/types';

export default function FloatChatApp() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVisualization, setCurrentVisualization] = useState<VisualizationSpec | null>(null);
  const [explainableData, setExplainableData] = useState<QueryMetadata | null>(null);
  const [showExplainableAI, setShowExplainableAI] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const response = await chatAPI.createSession();
      setSessionId(response.session_id);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to FloatChat! 🌊 I'm your AI oceanographer assistant. I can help you explore ARGO float data using natural language.

Try asking me things like:
• "Show me salinity profiles near the equator in March 2023"
• "Compare BGC parameters in the Arabian Sea"
• "Find unusual temperature readings in the Pacific"
• Or simply drop a pin on the map and ask about that location!

What would you like to discover today?`,
        timestamp: new Date(),
        confidence_score: 1.0
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };

  const handleSendMessage = async (content: string, context?: any) => {
    if (!sessionId || !content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatAPI.sendMessage(content, sessionId, context);
      setMessages(prev => [...prev, response]);
      
      if (response.visualization_spec) {
        setCurrentVisualization(response.visualization_spec);
      }
      
      if (response.query_metadata) {
        setExplainableData(response.query_metadata);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
        timestamp: new Date(),
        confidence_score: 0
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapQuery = (coordinates: [number, number], query: string) => {
    const context = {
      spatial_focus: {
        latitude: coordinates[0],
        longitude: coordinates[1]
      },
      source: 'map_interaction'
    };
    handleSendMessage(query, context);
  };

  const handleVoiceQuery = (transcript: string) => {
    handleSendMessage(transcript, { source: 'voice_input' });
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <SystemHeader 
        onToggleExplainableAI={() => setShowExplainableAI(!showExplainableAI)}
        onToggleVoice={() => setIsVoiceMode(!isVoiceMode)}
        showExplainableAI={showExplainableAI}
        isVoiceMode={isVoiceMode}
      />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Main Content Area */}
          <ResizablePanel defaultSize={showExplainableAI ? 70 : 100} minSize={50}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="border-b bg-white px-4 py-2 border-gray-200">
                <TabsList className="grid grid-cols-5 w-full max-w-md bg-white">
                  <TabsTrigger value="chat" className="nav-item flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="map" className="nav-item flex items-center gap-2">
                    <Map className="w-4 h-4" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="viz" className="nav-item flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Plots
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="nav-item flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="collab" className="nav-item flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team
                  </TabsTrigger>
                </TabsList>
                
                {isVoiceMode && (
                  <div className="mt-2">
                    <VoiceInput onTranscriptReady={handleVoiceQuery} />
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="chat" className="h-full m-0 p-0">
                  <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={70} minSize={30}>
                      <ChatInterface 
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        sessionId={sessionId}
                      />
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={30} minSize={20}>
                      <ContextPanel 
                        messages={messages}
                        onUpdateContext={(context) => {
                          if (sessionId) {
                            chatAPI.updateContext(sessionId, context);
                          }
                        }}
                      />
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </TabsContent>

                <TabsContent value="map" className="h-full m-0 p-0">
                  <MapView 
                    onLocationQuery={handleMapQuery}
                    visualizationData={currentVisualization}
                  />
                </TabsContent>

                <TabsContent value="viz" className="h-full m-0 p-0">
                  <VisualizationPanel 
                    specification={currentVisualization}
                    data={messages}
                  />
                </TabsContent>

                <TabsContent value="alerts" className="h-full m-0 p-0">
                  <AlertsPanel />
                </TabsContent>

                <TabsContent value="collab" className="h-full m-0 p-0">
                  <CollaborationPanel sessionId={sessionId} />
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>

          {/* Explainable AI Sidebar */}
          {showExplainableAI && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
                <ExplainableAISidebar 
                  queryMetadata={explainableData}
                  visualization={currentVisualization}
                  onClose={() => setShowExplainableAI(false)}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}