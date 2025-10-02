"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Palette, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Download, 
  Upload,
  RefreshCw,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Volume2,
  Mic,
  Eye,
  Zap
} from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';

interface SettingsPanelProps {
  onClose?: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Appearance
    fontSize: 14,
    compactMode: false,
    showAnimations: true,
    highContrast: false,
    
    // Notifications
    enableNotifications: true,
    soundEnabled: true,
    desktopNotifications: false,
    emailNotifications: true,
    
    // Data & Privacy
    saveHistory: true,
    autoExport: false,
    dataRetention: 30,
    analyticsEnabled: false,
    
    // Performance
    autoRefresh: true,
    refreshInterval: 30,
    cacheEnabled: true,
    preloadData: true,
    
    // Accessibility
    screenReader: false,
    keyboardNavigation: true,
    voiceCommands: false,
    
    // Language & Region
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    units: 'metric'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        fontSize: 14,
        compactMode: false,
        showAnimations: true,
        highContrast: false,
        enableNotifications: true,
        soundEnabled: true,
        desktopNotifications: false,
        emailNotifications: true,
        saveHistory: true,
        autoExport: false,
        dataRetention: 30,
        analyticsEnabled: false,
        autoRefresh: true,
        refreshInterval: 30,
        cacheEnabled: true,
        preloadData: true,
        screenReader: false,
        keyboardNavigation: true,
        voiceCommands: false,
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        units: 'metric'
      });
    }
  };

  const exportSettings = () => {
    const settingsData = {
      settings,
      theme,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(settingsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `floatchat-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.settings) {
              setSettings(data.settings);
              if (data.theme) {
                setTheme(data.theme);
              }
              alert('Settings imported successfully!');
            }
          } catch (error) {
            alert('Invalid settings file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="border-b bg-card border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <Badge variant="outline" className="text-xs">v1.0.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={exportSettings}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={importSettings}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button size="sm" variant="outline" onClick={resetSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {onClose && (
              <Button size="sm" onClick={onClose}>
                <Save className="w-4 h-4 mr-2" />
                Save & Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="appearance" className="h-full">
          <TabsList className="grid grid-cols-6 w-full max-w-2xl mb-6">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Regional
            </TabsTrigger>
          </TabsList>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Theme & Appearance
              </h3>
              
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Theme</Label>
                  <div className="flex gap-3">
                    <Button
                      variant={theme === 'light' ? 'default' : 'outline'}
                      onClick={() => setTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => setTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'default' : 'outline'}
                      onClick={() => setTheme('system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Font Size */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Font Size: {settings.fontSize}px
                  </Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={12}
                    max={20}
                    step={1}
                    className="w-full max-w-sm"
                  />
                </div>

                <Separator />

                {/* Display Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Compact Mode</Label>
                      <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Animations</Label>
                      <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
                    </div>
                    <Switch
                      checked={settings.showAnimations}
                      onCheckedChange={(checked) => updateSetting('showAnimations', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">High Contrast</Label>
                      <p className="text-xs text-muted-foreground">Increase color contrast</p>
                    </div>
                    <Switch
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive system notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Sound Notifications</Label>
                    <p className="text-xs text-muted-foreground">Play sounds for alerts</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Desktop Notifications</Label>
                    <p className="text-xs text-muted-foreground">Show browser notifications</p>
                  </div>
                  <Switch
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) => updateSetting('desktopNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data & Privacy
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Save Chat History</Label>
                    <p className="text-xs text-muted-foreground">Store conversation data locally</p>
                  </div>
                  <Switch
                    checked={settings.saveHistory}
                    onCheckedChange={(checked) => updateSetting('saveHistory', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto Export Data</Label>
                    <p className="text-xs text-muted-foreground">Automatically backup data</p>
                  </div>
                  <Switch
                    checked={settings.autoExport}
                    onCheckedChange={(checked) => updateSetting('autoExport', checked)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Data Retention: {settings.dataRetention} days
                  </Label>
                  <Slider
                    value={[settings.dataRetention]}
                    onValueChange={([value]) => updateSetting('dataRetention', value)}
                    min={7}
                    max={365}
                    step={7}
                    className="w-full max-w-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Analytics</Label>
                    <p className="text-xs text-muted-foreground">Help improve the app</p>
                  </div>
                  <Switch
                    checked={settings.analyticsEnabled}
                    onCheckedChange={(checked) => updateSetting('analyticsEnabled', checked)}
                  />
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance & Data
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto Refresh</Label>
                    <p className="text-xs text-muted-foreground">Automatically update data</p>
                  </div>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => updateSetting('autoRefresh', checked)}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Refresh Interval: {settings.refreshInterval}s
                  </Label>
                  <Slider
                    value={[settings.refreshInterval]}
                    onValueChange={([value]) => updateSetting('refreshInterval', value)}
                    min={10}
                    max={300}
                    step={10}
                    className="w-full max-w-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Enable Caching</Label>
                    <p className="text-xs text-muted-foreground">Cache data for faster loading</p>
                  </div>
                  <Switch
                    checked={settings.cacheEnabled}
                    onCheckedChange={(checked) => updateSetting('cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Preload Data</Label>
                    <p className="text-xs text-muted-foreground">Load data in background</p>
                  </div>
                  <Switch
                    checked={settings.preloadData}
                    onCheckedChange={(checked) => updateSetting('preloadData', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Accessibility Settings */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Accessibility Options
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Screen Reader Support</Label>
                    <p className="text-xs text-muted-foreground">Enhanced screen reader compatibility</p>
                  </div>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Keyboard Navigation</Label>
                    <p className="text-xs text-muted-foreground">Navigate using keyboard shortcuts</p>
                  </div>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Voice Commands</Label>
                    <p className="text-xs text-muted-foreground">Control app with voice</p>
                  </div>
                  <Switch
                    checked={settings.voiceCommands}
                    onCheckedChange={(checked) => updateSetting('voiceCommands', checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Regional Settings */}
          <TabsContent value="regional" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                      <SelectItem value="JST">Japan Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => updateSetting('dateFormat', value)}>
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Units</Label>
                  <Select value={settings.units} onValueChange={(value) => updateSetting('units', value)}>
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric (°C, m, kg)</SelectItem>
                      <SelectItem value="imperial">Imperial (°F, ft, lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
