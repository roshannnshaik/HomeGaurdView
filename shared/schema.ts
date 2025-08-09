import { sql } from "drizzle-orm";
import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  jsonb, 
  index,
  integer,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Doorbell devices
export const devices = pgTable("devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  location: varchar("location").notNull(),
  isOnline: boolean("is_online").default(true),
  streamUrl: varchar("stream_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity events
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  type: varchar("type").notNull(), // 'doorbell_ring', 'motion_detected', 'person_detected', 'door_unlocked', 'alert_triggered'
  title: varchar("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"), // Extra data like person name, confidence score, etc.
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Person recognition data
export const recognizedPersons = pgTable("recognized_persons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  name: varchar("name").notNull(),
  confidence: integer("confidence"), // 0-100
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device settings
export const deviceSettings = pgTable("device_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").references(() => devices.id).notNull(),
  motionSensitivity: integer("motion_sensitivity").default(50), // 0-100
  recordingEnabled: boolean("recording_enabled").default(true),
  nightVisionEnabled: boolean("night_vision_enabled").default(true),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  streamQuality: varchar("stream_quality").default('HD'), // 'SD', 'HD', '4K'
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertDeviceSchema = createInsertSchema(devices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  timestamp: true,
});

export const insertRecognizedPersonSchema = createInsertSchema(recognizedPersons).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceSettingsSchema = createInsertSchema(deviceSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type RecognizedPerson = typeof recognizedPersons.$inferSelect;
export type InsertRecognizedPerson = z.infer<typeof insertRecognizedPersonSchema>;
export type DeviceSettings = typeof deviceSettings.$inferSelect;
export type InsertDeviceSettings = z.infer<typeof insertDeviceSettingsSchema>;
