import { pgTable, serial, text, integer, doublePrecision, jsonb, timestamp } from "drizzle-orm/pg-core";

export const plansTable = pgTable("plans", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  eventTitle: text("event_title").notNull(),
  city: text("city").notNull(),
  budget: doublePrecision("budget").notNull(),
  guests: integer("guests").notNull(),
  plan: jsonb("plan").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Plan = typeof plansTable.$inferSelect;
export type InsertPlan = typeof plansTable.$inferInsert;
