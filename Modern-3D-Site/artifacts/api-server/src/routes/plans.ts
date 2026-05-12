import { Router, type IRouter } from "express";
import { ObjectId } from "mongodb";
import { getPlansCollection, connectDB } from "@workspace/db";
import { PlanEventBody, SavePlanBody, GetPlanParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// Python Festiva Planner backend URL
const PYTHON_BACKEND_URL = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

router.post("/plan-event", async (req, res, next) => {
  try {
    const body = PlanEventBody.parse(req.body);

    // Call Python Festiva Planner backend
    logger.info({ backend: PYTHON_BACKEND_URL }, "Calling Python backend for plan generation");
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/plan-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_text: body.user_text,
        budget: body.budget,
        guests: body.guests,
        duration: body.duration,
        city: body.city,
      }),
    });

    if (!response.ok) {
      logger.error({ status: response.status }, "Python backend returned error");
      res.status(response.status).json({ error: "Failed to generate plan from Python backend" });
      return;
    }

    const parsed = await response.json();

    // Ensure required fields are present
    parsed.budget = body.budget;
    parsed.guests = body.guests;
    parsed.duration = body.duration;
    parsed.city = body.city;

    const allocation = Array.isArray(parsed.budgetAllocation)
      ? (parsed.budgetAllocation as Array<{ amount?: number; percent?: number; name?: string; note?: string }>)
      : [];
    const total = allocation.reduce((s, c) => s + (Number(c.amount) || 0), 0);
    if (total > 0) {
      parsed.budgetAllocation = allocation.map((c) => ({
        name: String(c.name ?? "Other"),
        amount: Number(c.amount) || 0,
        percent: Math.round(((Number(c.amount) || 0) / total) * 1000) / 10,
        note: typeof c.note === "string" ? c.note : "",
      }));
    }

    res.json(parsed);
  } catch (err) {
    logger.error({ err }, "Error in plan-event endpoint");
    next(err);
  }
});

router.get("/plans", async (_req, res, next) => {
  try {
    const collection = await getPlansCollection();
    const plans = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(24)
      .toArray();

    res.json(
      plans.map((p) => ({
        id: p._id,
        eventType: p.eventType,
        eventTitle: p.eventTitle,
        city: p.city,
        budget: p.budget,
        guests: p.guests,
        createdAt: p.createdAt?.toISOString() || new Date().toISOString(),
      })),
    );
  } catch (err) {
    logger.error({ err }, "Error fetching plans");
    next(err);
  }
});

router.post("/plans", async (req, res, next) => {
  try {
    const body = SavePlanBody.parse(req.body);
    const plan = body.plan;
    const collection = await getPlansCollection();

    const insertedDoc = await collection.insertOne({
      eventType: plan.eventType,
      eventTitle: plan.eventTitle,
      city: plan.city,
      budget: plan.budget,
      guests: plan.guests,
      plan,
      createdAt: new Date(),
    });

    if (!insertedDoc.insertedId) {
      res.status(500).json({ error: "Failed to save plan" });
      return;
    }

    res.status(201).json({
      id: insertedDoc.insertedId.toString(),
      eventType: plan.eventType,
      eventTitle: plan.eventTitle,
      city: plan.city,
      budget: plan.budget,
      guests: plan.guests,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Error saving plan");
    next(err);
  }
});

router.get("/plans/:id", async (req, res, next) => {
  try {
    const { id } = GetPlanParams.parse({ id: req.params.id });
    const collection = await getPlansCollection();
    
    const row = await collection.findOne({
      _id: new ObjectId(String(id)),
    });

    if (!row) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({
      id: row._id?.toString(),
      createdAt: row.createdAt?.toISOString() || new Date().toISOString(),
      plan: row.plan,
    });
  } catch (err) {
    logger.error({ err }, "Error fetching plan");
    next(err);
  }
});

router.get("/stats", async (_req, res, next) => {
  try {
    const collection = await getPlansCollection();

    // Get totals
    const totals = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalPlans: { $sum: 1 },
            totalBudget: { $sum: "$budget" },
            totalGuests: { $sum: "$guests" },
          },
        },
      ])
      .toArray();

    // Get top event types
    const topEventTypes = await collection
      .aggregate([
        {
          $group: {
            _id: "$eventType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    // Get top cities
    const topCities = await collection
      .aggregate([
        {
          $group: {
            _id: "$city",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    const totalData = totals[0];

    res.json({
      totalPlans: totalData?.totalPlans ?? 0,
      totalBudgetPlanned: totalData?.totalBudget ?? 0,
      totalGuestsPlanned: totalData?.totalGuests ?? 0,
      topEventTypes: topEventTypes.map((t) => ({
        eventType: t._id,
        count: t.count,
      })),
      topCities: topCities.map((c) => ({
        city: c._id,
        count: c.count,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Error fetching stats");
    next(err);
  }
});

export default router;
