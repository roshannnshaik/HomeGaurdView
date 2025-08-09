import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video, Bell, User } from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { QuickActions } from "@/components/QuickActions";
import { ActivityFeed } from "@/components/ActivityFeed";
import { StatsOverview } from "@/components/StatsOverview";
import { UnlockModal } from "@/components/modals/UnlockModal";
import { TalkModal } from "@/components/modals/TalkModal";
import { NotificationToast } from "@/components/NotificationToast";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useActivity } from "@/hooks/useActivity";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const { lastMessage } = useWebSocket();
  
  // State for modals and notifications
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showTalkModal, setShowTalkModal] = useState(false);
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    visible: boolean;
  }>({ title: "", message: "", visible: false });

  // Setup initial data
  useQuery({
    queryKey: ["/api/setup"],
    retry: false,
  });

  // Get devices
  const { data: devices = [] } = useQuery({
    queryKey: ["/api/devices"],
  });

  const currentDevice = devices[0];
  const deviceId = currentDevice?.id;

  // Activity hook
  const {
    activities,
    stats,
    isLoading,
    unlockDoor,
    startTalk,
    stopTalk,
    triggerAlert,
    isUnlocking,
    isTriggering,
  } = useActivity(deviceId || "");

  // Handle real-time notifications
  useEffect(() => {
    if (lastMessage) {
      const { type, data } = lastMessage;
      
      if (type === "activity_created") {
        const activity = data;
        let title = "";
        let message = "";
        
        switch (activity.type) {
          case "doorbell_ring":
            title = "Doorbell Ring";
            message = "Someone is at your front door";
            break;
          case "person_detected":
            title = "Person Detected";
            message = activity.description || "Person detected at front door";
            break;
          case "motion_detected":
            title = "Motion Detected";
            message = "Movement detected at your front door";
            break;
          case "alert_triggered":
            title = "Security Alert";
            message = "Emergency alert has been triggered";
            break;
          default:
            title = activity.title;
            message = activity.description || "New activity detected";
        }
        
        setNotification({ title, message, visible: true });
      }
    }
  }, [lastMessage]);

  const handleUnlock = () => {
    unlockDoor();
    setShowUnlockModal(false);
    toast({
      title: "Door Unlocked",
      description: "Your front door has been unlocked for 10 seconds.",
    });
  };

  const handleTalk = () => {
    setShowTalkModal(true);
  };

  const handleAlert = () => {
    triggerAlert();
    toast({
      title: "Alert Triggered",
      description: "Emergency alert has been sent to your security contacts.",
      variant: "destructive",
    });
  };

  const handleScreenshot = () => {
    toast({
      title: "Screenshot Captured",
      description: "Image has been saved to your gallery.",
    });
  };

  if (!currentDevice) {
    return (
      <div className="min-h-screen bg-light-gray flex items-center justify-center">
        <div className="text-center">
          <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Setting up your doorbell...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-nav-teal rounded-full flex items-center justify-center">
              <Video className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-dark-gray">
                {currentDevice.name}
              </h1>
              <p className="text-xs text-gray-500">
                {currentDevice.location}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                <Bell className="h-5 w-5" />
                {activities.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-coral rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                alt="User Profile" 
                className="w-8 h-8 rounded-full object-cover" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <VideoPlayer 
        streamUrl={currentDevice.streamUrl}
        isLive={currentDevice.isOnline}
        onScreenshot={handleScreenshot}
      />

      {/* Quick Actions */}
      <QuickActions
        onTalk={handleTalk}
        onUnlock={() => setShowUnlockModal(true)}
        onAlert={handleAlert}
        isUnlocking={isUnlocking}
        isTriggering={isTriggering}
      />

      {/* Activity Feed */}
      <ActivityFeed 
        activities={activities}
        onViewAll={() => window.location.href = "/history"}
      />

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Modals */}
      <UnlockModal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        onConfirm={handleUnlock}
        isUnlocking={isUnlocking}
      />

      <TalkModal
        isOpen={showTalkModal}
        onClose={() => setShowTalkModal(false)}
        onStart={startTalk}
        onStop={stopTalk}
      />

      {/* Notification Toast */}
      <NotificationToast
        title={notification.title}
        message={notification.message}
        isVisible={notification.visible}
        onDismiss={() => setNotification(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
