import {
  users,
  devices,
  activities,
  recognizedPersons,
  deviceSettings,
  type User,
  type UpsertUser,
  type Device,
  type InsertDevice,
  type Activity,
  type InsertActivity,
  type RecognizedPerson,
  type InsertRecognizedPerson,
  type DeviceSettings,
  type InsertDeviceSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Device operations
  getUserDevices(userId: string): Promise<Device[]>;
  getDevice(id: string): Promise<Device | undefined>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDeviceStatus(id: string, isOnline: boolean): Promise<void>;
  
  // Activity operations
  getDeviceActivities(deviceId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivityStats(deviceId: string, date: Date): Promise<{
    visitors: number;
    detections: number;
    alerts: number;
  }>;
  
  // Person recognition operations
  getRecognizedPersons(deviceId: string): Promise<RecognizedPerson[]>;
  createRecognizedPerson(person: InsertRecognizedPerson): Promise<RecognizedPerson>;
  
  // Device settings operations
  getDeviceSettings(deviceId: string): Promise<DeviceSettings | undefined>;
  upsertDeviceSettings(settings: InsertDeviceSettings): Promise<DeviceSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserDevices(userId: string): Promise<Device[]> {
    return await db.select().from(devices).where(eq(devices.userId, userId));
  }

  async getDevice(id: string): Promise<Device | undefined> {
    const [device] = await db.select().from(devices).where(eq(devices.id, id));
    return device;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const [newDevice] = await db.insert(devices).values(device).returning();
    return newDevice;
  }

  async updateDeviceStatus(id: string, isOnline: boolean): Promise<void> {
    await db
      .update(devices)
      .set({ isOnline, updatedAt: new Date() })
      .where(eq(devices.id, id));
  }

  async getDeviceActivities(deviceId: string, limit = 20): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.deviceId, deviceId))
      .orderBy(desc(activities.timestamp))
      .limit(limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivityStats(deviceId: string, date: Date): Promise<{
    visitors: number;
    detections: number;
    alerts: number;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [stats] = await db
      .select({
        visitors: sql<number>`COUNT(CASE WHEN type = 'doorbell_ring' THEN 1 END)`,
        detections: sql<number>`COUNT(CASE WHEN type IN ('motion_detected', 'person_detected') THEN 1 END)`,
        alerts: sql<number>`COUNT(CASE WHEN type = 'alert_triggered' THEN 1 END)`,
      })
      .from(activities)
      .where(
        and(
          eq(activities.deviceId, deviceId),
          sql`${activities.timestamp} >= ${startOfDay}`,
          sql`${activities.timestamp} <= ${endOfDay}`
        )
      );

    return {
      visitors: Number(stats.visitors) || 0,
      detections: Number(stats.detections) || 0,
      alerts: Number(stats.alerts) || 0,
    };
  }

  async getRecognizedPersons(deviceId: string): Promise<RecognizedPerson[]> {
    return await db
      .select()
      .from(recognizedPersons)
      .where(eq(recognizedPersons.deviceId, deviceId))
      .orderBy(desc(recognizedPersons.createdAt));
  }

  async createRecognizedPerson(person: InsertRecognizedPerson): Promise<RecognizedPerson> {
    const [newPerson] = await db.insert(recognizedPersons).values(person).returning();
    return newPerson;
  }

  async getDeviceSettings(deviceId: string): Promise<DeviceSettings | undefined> {
    const [settings] = await db
      .select()
      .from(deviceSettings)
      .where(eq(deviceSettings.deviceId, deviceId));
    return settings;
  }

  async upsertDeviceSettings(settings: InsertDeviceSettings): Promise<DeviceSettings> {
    const [updatedSettings] = await db
      .insert(deviceSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: deviceSettings.deviceId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return updatedSettings;
  }
}

export const storage = new DatabaseStorage();
