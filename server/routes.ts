import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertActivitySchema, insertDeviceSchema, insertDeviceSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('WebSocket client connected');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  function broadcast(data: any) {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Mock user for development (replace with actual auth)
  const mockUserId = "mock-user-123";

  // Ensure mock user and device exist
  app.get("/api/setup", async (req, res) => {
    try {
      // Create mock user
      await storage.upsertUser({
        id: mockUserId,
        email: "user@example.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      });

      // Create mock device
      const devices = await storage.getUserDevices(mockUserId);
      if (devices.length === 0) {
        await storage.createDevice({
          userId: mockUserId,
          name: "Smart Doorbell",
          location: "Front Door",
          streamUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Setup error:", error);
      res.status(500).json({ message: "Setup failed" });
    }
  });

  // Get user devices
  app.get("/api/devices", async (req, res) => {
    try {
      const devices = await storage.getUserDevices(mockUserId);
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  // Get device activities
  app.get("/api/devices/:deviceId/activities", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getDeviceActivities(deviceId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Create new activity
  app.post("/api/devices/:deviceId/activities", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const activityData = insertActivitySchema.parse({
        ...req.body,
        deviceId,
      });

      const activity = await storage.createActivity(activityData);
      
      // Broadcast real-time update
      broadcast({
        type: 'activity_created',
        data: activity,
      });

      res.json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Get device stats
  app.get("/api/devices/:deviceId/stats", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      const stats = await storage.getActivityStats(deviceId, date);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Door unlock endpoint
  app.post("/api/devices/:deviceId/unlock", async (req, res) => {
    try {
      const { deviceId } = req.params;
      
      // Create unlock activity
      const activity = await storage.createActivity({
        deviceId,
        type: "door_unlocked",
        title: "Door Unlocked",
        description: "Door unlocked remotely via app",
        metadata: { unlockMethod: "app", userId: mockUserId },
      });

      // Broadcast real-time update
      broadcast({
        type: 'door_unlocked',
        data: activity,
      });

      res.json({ success: true, activity });
    } catch (error) {
      console.error("Error unlocking door:", error);
      res.status(500).json({ message: "Failed to unlock door" });
    }
  });

  // Talk session endpoint
  app.post("/api/devices/:deviceId/talk", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const { action } = req.body; // 'start' or 'stop'
      
      if (action === 'start') {
        // Log talk session start
        const activity = await storage.createActivity({
          deviceId,
          type: "talk_session",
          title: "Two-Way Audio Started",
          description: "User initiated two-way audio conversation",
          metadata: { action: "start", userId: mockUserId },
        });

        broadcast({
          type: 'talk_started',
          data: activity,
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error managing talk session:", error);
      res.status(500).json({ message: "Failed to manage talk session" });
    }
  });

  // Trigger alert endpoint
  app.post("/api/devices/:deviceId/alert", async (req, res) => {
    try {
      const { deviceId } = req.params;
      
      const activity = await storage.createActivity({
        deviceId,
        type: "alert_triggered",
        title: "Emergency Alert",
        description: "Emergency alert triggered by user",
        metadata: { userId: mockUserId, alertLevel: "high" },
      });

      // Broadcast real-time update
      broadcast({
        type: 'alert_triggered',
        data: activity,
      });

      res.json({ success: true, activity });
    } catch (error) {
      console.error("Error triggering alert:", error);
      res.status(500).json({ message: "Failed to trigger alert" });
    }
  });

  // Device settings endpoints
  app.get("/api/devices/:deviceId/settings", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const settings = await storage.getDeviceSettings(deviceId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/devices/:deviceId/settings", async (req, res) => {
    try {
      const { deviceId } = req.params;
      const settingsData = insertDeviceSettingsSchema.parse({
        ...req.body,
        deviceId,
      });

      const settings = await storage.upsertDeviceSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Simulate periodic activities for demo
  setInterval(async () => {
    try {
      const devices = await storage.getUserDevices(mockUserId);
      if (devices.length > 0) {
        const device = devices[0];
        
        // Randomly create different types of activities
        const activities = [
          {
            type: "motion_detected",
            title: "Motion Detected",
            description: "Movement detected in detection zone",
          },
          {
            type: "person_detected", 
            title: "Person Detected",
            description: "Unknown person detected at front door",
          },
          {
            type: "doorbell_ring",
            title: "Doorbell Ring", 
            description: "Someone pressed the doorbell",
          },
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        const activity = await storage.createActivity({
          deviceId: device.id,
          ...randomActivity,
          metadata: { automated: true },
        });

        broadcast({
          type: 'activity_created',
          data: activity,
        });
      }
    } catch (error) {
      console.error("Error creating simulated activity:", error);
    }
  }, 30000); // Every 30 seconds

  return httpServer;
}
