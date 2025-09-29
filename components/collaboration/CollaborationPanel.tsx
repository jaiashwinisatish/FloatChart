"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Share, 
  MessageSquare, 
  Link,
  UserPlus,
  Settings,
  Download,
  BookOpen,
  Clock,
  Eye
} from 'lucide-react';

interface CollaborationPanelProps {
  sessionId: string;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
  role: 'owner' | 'editor' | 'viewer';
}

interface SharedQuery {
  id: string;
  title: string;
  query: string;
  author: string;
  createdAt: Date;
  views: number;
  bookmarked: boolean;
}

export function CollaborationPanel({ sessionId }: CollaborationPanelProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [sharedQueries, setSharedQueries] = useState<SharedQuery[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'team' | 'queries'>('team');

  useEffect(() => {
    // Mock data - in production, fetch from API
    setCollaborators([
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@oceaninst.org',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=40&h=40&fit=crop&crop=face',
        status: 'online',
        lastSeen: new Date(),
        role: 'owner'
      },
      {
        id: '2',
        name: 'Prof. James Miller',
        email: 'j.miller@university.edu',
        status: 'online',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        role: 'editor'
      },
      {
        id: '3',
        name: 'Alex Rodriguez',
        email: 'alex.r@research.org',
        status: 'away',
        lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        role: 'viewer'
      }
    ]);

    setSharedQueries([
      {
        id: '1',
        title: 'Arabian Sea Temperature Profiles',
        query: 'Show me temperature profiles in the Arabian Sea for March 2023',
        author: 'Dr. Sarah Chen',
        createdAt: new Date('2023-11-15T10:30:00Z'),
        views: 23,
        bookmarked: true
      },
      {
        id: '2',
        title: 'Monsoon Salinity Analysis',
        query: 'Compare salinity variations during monsoon season',
        author: 'Prof. James Miller',
        createdAt: new Date('2023-11-14T16:45:00Z'),
        views: 18,
        bookmarked: false
      },
      {
        id: '3',
        title: 'BGC Parameter Correlations',
        query: 'Analyze correlations between chlorophyll and nutrient levels',
        author: 'Alex Rodriguez',
        createdAt: new Date('2023-11-13T14:20:00Z'),
      }
    ]);
  }, [sessionId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-white border border-gray-300';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inviteCollaborator = () => {
    if (inviteEmail.trim()) {
      // TODO: Implement invite functionality
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Collaboration</h3>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'team' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('team')}
          >
            <Users className="w-4 h-4 mr-2" />
            Team ({collaborators.length})
          </Button>
          <Button
            variant={activeTab === 'queries' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('queries')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Shared Queries ({sharedQueries.length})
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {activeTab === 'team' && (
          <div className="space-y-4">
            {/* Invite Section */}
            <Card className="p-4 bg-card border-border">
              <h4 className="font-medium text-foreground mb-3">Invite Collaborator</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address..."
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && inviteCollaborator()}
                  className="flex-1"
                  className="flex-1 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={inviteCollaborator} size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </Card>

            {/* Team Members */}
            <div className="space-y-2">
              {collaborators.map(collaborator => (
                <Card key={collaborator.id} className="p-3 bg-card border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback>
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(collaborator.status)}`} />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{collaborator.name}</div>
                        <div className="text-xs text-muted-foreground">{collaborator.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${getRoleColor(collaborator.role)}`}>
                        {collaborator.role}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {collaborator.status === 'online' ? 'Active now' : formatTimeAgo(collaborator.lastSeen)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Session Sharing */}
            <Card className="p-4 bg-card border-border">
              <h4 className="font-medium text-foreground mb-3">Share This Session</h4>
              <div className="flex gap-2 mb-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Link className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Anyone with the link can view this session
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="space-y-3">
            {sharedQueries.map(query => (
              <Card key={query.id} className="p-4 bg-card border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 text-foreground">{query.title}</h4>
                    <p className="text-xs text-muted-foreground italic mb-2">"{query.query}"</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>by {query.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(query.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {query.views} views
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <BookOpen className={`w-3 h-3 ${query.bookmarked ? 'text-white' : 'text-gray-400'}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Share className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Run Query
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    Fork
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t bg-card border-border p-4">
        <Button variant="outline" size="sm" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Export Collaboration Report
        </Button>
      </div>
    </div>
  );
}