import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "./useWebSocket";
import { useEffect } from "react";
import type { Activity } from "@shared/schema";

export function useActivity(deviceId: string) {
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();

  // Fetch activities
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/devices", deviceId, "activities"],
    enabled: !!deviceId,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["/api/devices", deviceId, "stats"],
    enabled: !!deviceId,
  });

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: async (activityData: any) => {
      const response = await apiRequest("POST", `/api/devices/${deviceId}/activities`, activityData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "stats"] });
    },
  });

  // Door unlock mutation
  const unlockDoorMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/devices/${deviceId}/unlock`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "stats"] });
    },
  });

  // Talk session mutation
  const talkMutation = useMutation({
    mutationFn: async (action: "start" | "stop") => {
      const response = await apiRequest("POST", `/api/devices/${deviceId}/talk`, { action });
      return response.json();
    },
  });

  // Alert trigger mutation
  const alertMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/devices/${deviceId}/alert`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "stats"] });
    },
  });

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage && lastMessage.type === "activity_created") {
      const newActivity = lastMessage.data as Activity;
      if (newActivity.deviceId === deviceId) {
        queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "activities"] });
        queryClient.invalidateQueries({ queryKey: ["/api/devices", deviceId, "stats"] });
      }
    }
  }, [lastMessage, deviceId, queryClient]);

  return {
    activities,
    stats,
    isLoading,
    createActivity: createActivityMutation.mutate,
    unlockDoor: unlockDoorMutation.mutate,
    startTalk: () => talkMutation.mutate("start"),
    stopTalk: () => talkMutation.mutate("stop"),
    triggerAlert: alertMutation.mutate,
    isUnlocking: unlockDoorMutation.isPending,
    isTalking: talkMutation.isPending,
    isTriggering: alertMutation.isPending,
  };
}
