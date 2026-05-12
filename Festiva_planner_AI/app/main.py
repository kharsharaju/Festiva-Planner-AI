from fastapi import FastAPI
from app.agents.planner_agent import plan_event_with_agents

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Festiva Planner AI (Agents) running"}

import datetime
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["festiva_db"]
plans_collection = db["plans"]
vendors_collection = db["vendors"]
users_collection = db["users"]

@app.post("/signup")
def signup(user: dict):
    # Check if user already exists
    if users_collection.find_one({"email": user["email"]}):
        return {"error": "User already exists"}, 400
    
    users_collection.insert_one({
        "email": user["email"],
        "password": user["password"], # In production, use hashing!
        "name": user.get("name", ""),
        "created_at": datetime.datetime.now()
    })
    return {"message": "User created successfully"}

@app.post("/login")
def login(credentials: dict):
    user = users_collection.find_one({
        "email": credentials["email"],
        "password": credentials["password"]
    })
    if not user:
        return {"error": "Invalid email or password"}, 401
    
    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "name": user.get("name", "")
        }
    }

import pandas as pd
import os

# Seed vendors database if empty
if vendors_collection.count_documents({}) == 0:
    csv_path = os.path.join("data", "vendors.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # Drop empty rows
        df = df.dropna(subset=["vendor_name"])
        
        vendors_list = []
        for _, row in df.iterrows():
            vendors_list.append({
                "name": row["vendor_name"],
                "category": row["category"].capitalize(),
                "price": float(row["price"]),
                "rating": float(row["rating"]),
                "city": row["city"],
                "contact": row["email"] if pd.notna(row["email"]) else row["contact"],
                "tagline": f"Premier {row['category']} services in {row['city']}."
            })
        
        if vendors_list:
            vendors_collection.insert_many(vendors_list)
            print(f"Successfully imported {len(vendors_list)} vendors from CSV.")

# Seed plans database if empty
if plans_collection.count_documents({}) == 0:
    csv_path = os.path.join("data", "events.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        
        plans_list = []
        for i, row in df.iterrows():
            event_type = str(row["event_type"]).capitalize()
            plans_list.append({
                "id": i + 1,
                "eventType": event_type,
                "eventTitle": f"{row['city']} {event_type} Celebration",
                "dateSaved": (datetime.datetime.now() - datetime.timedelta(days=i)).isoformat() + "Z",
                "summary": f"A beautiful {event_type} in {row['city']} for {int(row['guests'])} guests.",
                "city": row["city"],
                "guests": int(row["guests"]),
                "budget": float(row["budget"])
            })
        
        if plans_list:
            plans_collection.insert_many(plans_list)
            print(f"Successfully imported {len(plans_list)} plans from CSV.")

@app.post("/plan-event")
def create_plan(event: dict):
    # 1. Generate the plan using the AI agents
    plan_result = plan_event_with_agents(
        user_text=event["user_text"],
        budget=event["budget"],
        guests=event["guests"],
        duration=event["duration"],
        city=event["city"]
    )
    
    # 2. Extract event type from the AI result (it returns dict with event_type)
    event_type = plan_result.get("event_type", "Custom Event").capitalize()
    
    # 3. Save a summary to MongoDB
    new_id = plans_collection.count_documents({}) + 1
    new_plan_summary = {
        "id": new_id,
        "eventType": event_type,
        "eventTitle": f"{event['city']} {event_type} Experience",
        "dateSaved": datetime.datetime.now().isoformat() + "Z",
        "summary": event["user_text"][:100] + "...",
        "city": event["city"],
        "guests": event["guests"],
        "budget": event["budget"]
    }
    plans_collection.insert_one(new_plan_summary)
    
    return plan_result

@app.get("/plans")
def list_plans():
    # Fetch from Mongo, remove _id
    plans = list(plans_collection.find({}, {"_id": 0}))
    # Sort descending by id
    plans.sort(key=lambda x: x.get("id", 0), reverse=True)
    return plans

@app.get("/vendors")
def list_vendors():
    # Fetch vendors from Mongo, remove _id
    vendors = list(vendors_collection.find({}, {"_id": 0}))
    return vendors

@app.get("/stats")
def get_stats():
    plans = list(plans_collection.find({}, {"_id": 0}))
    
    total_budget = sum(p.get("budget", 0) for p in plans)
    total_guests = sum(p.get("guests", 0) for p in plans)
    
    # Calculate top cities
    city_counts = {}
    for p in plans:
        c = p.get("city", "Unknown")
        city_counts[c] = city_counts.get(c, 0) + 1
    top_cities = [{"city": k, "count": v} for k, v in sorted(city_counts.items(), key=lambda item: item[1], reverse=True)][:3]
    
    # Calculate top event types
    type_counts = {}
    for p in plans:
        t = p.get("eventType", "Custom")
        type_counts[t] = type_counts.get(t, 0) + 1
    top_types = [{"eventType": k, "count": v} for k, v in sorted(type_counts.items(), key=lambda item: item[1], reverse=True)][:3]

    return {
        "totalPlans": len(plans),
        "totalBudgetPlanned": total_budget,
        "totalGuestsPlanned": total_guests,
        "topCities": top_cities,
        "topEventTypes": top_types
    }