import { User, Bell, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Activity } from "@shared/schema";

interface ActivityFeedProps {
  activities: Activity[];
  onViewAll: () => void;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "person_detected":
      return <User className="h-4 w-4 text-white" />;
    case "doorbell_ring":
      return <Bell className="h-4 w-4 text-white" />;
    case "motion_detected":
      return <Users className="h-4 w-4 text-white" />;
    case "door_unlocked":
      return <Clock className="h-4 w-4 text-white" />;
    case "alert_triggered":
      return <Clock className="h-4 w-4 text-white" />;
    default:
      return <Clock className="h-4 w-4 text-white" />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "person_detected":
      return "bg-soft-teal";
    case "doorbell_ring":
      return "bg-accent-coral";
    case "motion_detected":
      return "bg-primary-blue";
    case "door_unlocked":
      return "bg-nav-teal";
    case "alert_triggered":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function ActivityFeed({ activities, onViewAll }: ActivityFeedProps) {
  const recentActivities = activities.slice(0, 5);

  return (
    <section className="bg-white">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-gray">Recent Activity</h2>
          <Button 
            variant="ghost" 
            onClick={onViewAll}
            className="text-primary-blue text-sm font-medium p-0 h-auto hover:bg-transparent"
          >
            View All
          </Button>
        </div>
        
        {/* Activity Timeline */}
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-light-gray rounded-xl">
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-dark-gray">{activity.title}</p>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  {activity.videoUrl && (
                    <Button 
                      variant="ghost"
                      className="text-primary-blue text-xs font-medium mt-2 p-0 h-auto hover:bg-transparent"
                    >
                      View Recording
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
