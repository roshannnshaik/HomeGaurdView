import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Filter, Calendar, Download } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ActivityFeed } from "@/components/ActivityFeed";
import { BottomNavigation } from "@/components/BottomNavigation";
import type { Activity } from "@shared/schema";

export default function History() {
  const [filter, setFilter] = useState<string>("all");

  // Get devices
  const { data: devices = [] } = useQuery({
    queryKey: ["/api/devices"],
  });

  const currentDevice = devices[0];
  const deviceId = currentDevice?.id;

  // Get all activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/devices", deviceId, "activities"],
    enabled: !!deviceId,
  });

  const filterOptions = [
    { value: "all", label: "All Activity" },
    { value: "doorbell_ring", label: "Doorbell Rings" },
    { value: "person_detected", label: "Person Detection" },
    { value: "motion_detected", label: "Motion Alerts" },
    { value: "door_unlocked", label: "Door Unlocks" },
    { value: "alert_triggered", label: "Security Alerts" },
  ];

  const filteredActivities = activities.filter((activity: Activity) => 
    filter === "all" || activity.type === filter
  );

  const groupedActivities = filteredActivities.reduce((groups: Record<string, Activity[]>, activity: Activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

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
              <h1 className="text-lg font-semibold text-dark-gray">Activity History</h1>
              <p className="text-xs text-gray-500">{filteredActivities.length} events</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Calendar className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap text-xs ${
                filter === option.value 
                  ? "bg-nav-teal hover:bg-nav-teal/90" 
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="px-4 py-4 space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nav-teal mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading activities...</p>
          </div>
        ) : Object.keys(groupedActivities).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your filter or check back later.</p>
          </div>
        ) : (
          Object.entries(groupedActivities).map(([date, dayActivities]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {date}
              </h3>
              <ActivityFeed 
                activities={dayActivities}
                onViewAll={() => {}}
              />
            </div>
          ))
        )}
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
