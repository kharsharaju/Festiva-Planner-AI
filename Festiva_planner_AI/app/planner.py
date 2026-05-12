import pandas as pd
import pickle
from app.nlp_model import predict_event_type
from app.rag import query_rag   # ✅ IMPORTANT

def load_model():
    with open("models/budget_model.pkl", "rb") as f:
        return pickle.load(f)

def load_vendors(city):
    df = pd.read_csv("data/vendors.csv")
    return df[df["city"].str.lower() == city.lower()]

def suggest_vendors(vendors_df, category, max_price):
    filtered = vendors_df[
        (vendors_df["category"] == category) &
        (vendors_df["price"] <= max_price) &
        (vendors_df["availability"] == "yes")
    ]

    # If no matching vendors
    if filtered.empty:
        fallback = vendors_df[
            (vendors_df["category"] == category) &
            (vendors_df["availability"] == "yes")
        ]

        if fallback.empty:
            # 🔥 RETURN EMPTY DATAFRAME (not list)
            return pd.DataFrame(columns=vendors_df.columns)

        return fallback.sort_values(by="rating", ascending=False).head(1)

    return filtered.sort_values(by="rating", ascending=False).head(2)

def generate_timeline(event_type):
    if event_type == "wedding":
        return ["Book venue", "Hire caterer", "Decoration setup", "Event day"]
    elif event_type == "corporate":
        return ["Finalize agenda", "Book venue", "Arrange catering", "Event day"]
    else:
        return ["Plan activities", "Decorate venue", "Event day"]

def plan_event(user_text, budget, guests, duration, city):
    model = load_model()

    # 🔥 NLP
    event_type = predict_event_type(user_text)

    # 🔥 RAG
    advice = query_rag(user_text)

    input_data = pd.DataFrame(
        [[budget, guests, duration]],
        columns=["budget", "guests", "event_duration_days"]
    )

    prediction = model.predict(input_data)[0]

    catering, decoration, venue, entertainment = prediction

    vendors = load_vendors(city)

    result = {
        "event_type": event_type,
        "budget": budget,
        "predicted_costs": {
            "catering": round(float(catering), 2),
            "decoration": round(float(decoration), 2),
            "venue": round(float(venue), 2),
            "entertainment": round(float(entertainment), 2)
        },
        "timeline": generate_timeline(event_type),
        "vendors": {
            "catering": suggest_vendors(vendors, "catering", catering).to_dict(orient="records"),
            "decoration": suggest_vendors(vendors, "decoration", decoration).to_dict(orient="records"),
            "venue": suggest_vendors(vendors, "venue", venue).to_dict(orient="records"),
            "entertainment": suggest_vendors(vendors, "entertainment", entertainment).to_dict(orient="records")
        },
        "advice": advice   
    }

    return result