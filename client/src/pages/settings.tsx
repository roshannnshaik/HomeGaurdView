import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Bell, Video, Shield, Moon, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNavigation } from "@/components/BottomNavigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get devices
  const { data: devices = [] } = useQuery({
    queryKey: ["/api/devices"],
  });

  const currentDevice = devices[0];
  const deviceId = currentDevice?.id;

  // Get device settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/devices", deviceId, "settings"],
    enabled: !!deviceId,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await apiRequest("PUT", `/api/devices/${deviceId}/settings`, newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "settings"] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    if (settings) {
      updateSettingsMutation.mutate({
        ...settings,
        [key]: value,
      });
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nav-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-dark-gray">Settings</h1>
              <p className="text-xs text-gray-500">Configure your doorbell</p>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Sections */}
      <div className="px-4 py-4 space-y-6">
        
        {/* Video Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Video className="h-5 w-5 text-primary-blue" />
            <h2 className="text-lg font-semibold text-dark-gray">Video Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-dark-gray">Recording Enabled</p>
                <p className="text-sm text-gray-500">Automatically record activities</p>
              </div>
              <Switch
                checked={settings.recordingEnabled}
                onCheckedChange={(checked) => handleSettingChange("recordingEnabled", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-dark-gray">Night Vision</p>
                <p className="text-sm text-gray-500">Enable infrared night vision</p>
              </div>
              <Switch
                checked={settings.nightVisionEnabled}
                onCheckedChange={(checked) => handleSettingChange("nightVisionEnabled", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-dark-gray">Stream Quality</p>
              <Select
                value={settings.streamQuality}
                onValueChange={(value) => handleSettingChange("streamQuality", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD (480p)</SelectItem>
                  <SelectItem value="HD">HD (720p)</SelectItem>
                  <SelectItem value="4K">4K (2160p)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Detection Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-soft-teal" />
            <h2 className="text-lg font-semibold text-dark-gray">Detection Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium text-dark-gray">Motion Sensitivity</p>
                <span className="text-sm text-gray-500">{settings.motionSensitivity}%</span>
              </div>
              <Slider
                value={[settings.motionSensitivity]}
                onValueChange={(value) => handleSettingChange("motionSensitivity", value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-5 w-5 text-accent-coral" />
            <h2 className="text-lg font-semibold text-dark-gray">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-dark-gray">Push Notifications</p>
                <p className="text-sm text-gray-500">Get notified of all activities</p>
              </div>
              <Switch
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => handleSettingChange("notificationsEnabled", checked)}
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Moon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-dark-gray">General</h2>
          </div>
          
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "Privacy Settings",
                  description: "Privacy settings panel would open here.",
                });
              }}
            >
              Privacy & Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                toast({
                  title: "About",
                  description: "Smart Doorbell v1.0.0",
                });
              }}
            >
              About
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
